import { Context } from './context.model'
import { bindOperations } from './operations'
import { DatabaseChange } from '../../lib/database-change.model'
import WebSocket from 'ws'

import { Database } from 'naive-core'

type CleanupRoutine = () => Promise<void>

export const runServer = async (ctx: Context): Promise<CleanupRoutine> => {
  const db = new Database()
  await db.init()
  const wss = new WebSocket.Server({ port: ctx.wsPort })

  const socketCleanup = () =>
    new Promise(resolve => {
      wss.close(resolve)
    })

  const operationCleanup = await bindOperations(
    ctx,
    db,
    async (dbChange: DatabaseChange) => {
      for (let client of wss.clients) {
        client.send(JSON.stringify(dbChange))
      }
    }
  )
  return async () => {
    Promise.all([operationCleanup(), socketCleanup()])
  }
}
