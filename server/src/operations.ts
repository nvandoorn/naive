import { Context } from './context.model'
import { SubscriptionRequest } from '../../lib/subscription-req.model'
import { WriteRequest } from '../../lib/write-req.model'
import { DatabaseChange } from '../../lib/database-change.model'

import { DatabaseInterface } from 'naive-core'

import express, { RequestHandler } from 'express'
import bodyParser from 'body-parser'

export const bindOperations = (
  ctx: Context,
  db: DatabaseInterface,
  send: (e: DatabaseChange) => Promise<any>
) => {
  const unsubs: { [key: string]: () => any } = {}

  const writeHandler: RequestHandler = async (req, res) => {
    const { path, toWrite } = req.body as WriteRequest
    await db.write(path, toWrite)
    res.status(200).end()
  }

  const addSubHandler: RequestHandler = async (req, res) => {
    const { path } = req.body as SubscriptionRequest
    // only allow users to subscribe
    // to a given path once
    // TODO return a better error
    if (unsubs[path]) {
      res.status(500).end()
      return
    }
    unsubs[path] = db.subscribe(path, async (change: Object) => {
      await send({
        path,
        change
      })
    })
    res.status(200).end()
  }

  const removeSubHandler: RequestHandler = async (req, res) => {
    const { path } = req.body as SubscriptionRequest
    const unsub = unsubs[path]
    if (unsub) unsub()
  }

  const router = express()
  router.use(bodyParser.json())
  router.post('/write', writeHandler)
  router
    .route('/subscribe')
    .post(addSubHandler)
    .delete(removeSubHandler)
  router.listen(ctx.httpPort, () => ctx.logger('HTTPS server started'))
}
