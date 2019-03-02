import { Config } from './config.model'
import { getKey } from '../../lib/util'
import { encodePath } from '../../lib/path'
import { DatabaseConnection } from './database-connection.model'
import { DatabaseChange } from '../../lib/database-change.model'
import { Body } from 'node-fetch'

import WebSocket from 'ws'

const objectToQuery = (query: Object): string =>
  Object.values(query).reduce(
    (acc: string, [key, val]: [string, string]) => acc + `${key}=${val}&`,
    '?'
  )

// each path has one or more callbacks
// that must be fired with each change
interface CallbackTable {
  [path: string]: CallbackRef[]
}

interface CallbackRef {
  id: string
  callback: (e: Object) => void
}

/**
 * Client side implementation is implemented using
 * a function/factory instead of a class to reduce bundle
 * size
 */
export const dbFactory = (config: Config): DatabaseConnection => {
  // TODO figure out how to patch
  // in native fetch/websocke instead
  // when this is running in the browser
  const nodeFetch = require('node-fetch')
  const WebSocket = require('ws')

  let ws: WebSocket | null
  let subCallbacks: CallbackTable = {}

  const send = (method: string) => (
    route: string,
    body: Object | void
  ): Promise<Body> => {
    const isGet = method === 'GET'
    if (isGet && body) {
      route += objectToQuery(body)
    }
    return nodeFetch(route, {
      method,
      ...(isGet ? undefined : { body: JSON.stringify(body) }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  const hget = (route: string, body: Object | void) =>
    send('GET')(route, body).then((r: any) => r.json())
  const hpost = send('POST')

  const write = (path: string, toWrite: Object | null) => {
    const { httpUrl } = config
    return hpost(`${httpUrl}/write`, {
      path,
      toWrite
    })
  }

  const read = (path: string): Promise<any> => {
    const { httpUrl } = config
    return hget(`${httpUrl}/read/${encodePath(path)}`)
  }

  const socketMessageHandler = (event: {
    data: any
    type: string
    target: WebSocket
  }) => {
    const dbChange: DatabaseChange = JSON.parse(event.data)
    const callbackRefs = subCallbacks[dbChange.path]
    if (callbackRefs && callbackRefs.length) {
      for (let ref of callbackRefs) {
        ref.callback(dbChange.change)
      }
    }
  }

  return {
    init() {
      return new Promise(resolve => {
        ws = new WebSocket(config.wsUrl)
        // @ts-ignore
        ws.addEventListener('message', socketMessageHandler)
        // @ts-ignore
        ws.addEventListener('open', () => resolve())
      })
    },
    close() {
      if (ws) {
        ws.removeEventListener('message', socketMessageHandler)
        ws.close()
        ws = null
      }
    },
    async subscribe(path: string, callback: (e: Object) => void) {
      const id = getKey('callbackref')
      const ref: CallbackRef = {
        id,
        callback
      }
      if (!subCallbacks[path]) {
        const { httpUrl } = config
        subCallbacks[path] = [ref]
        await hpost(`${httpUrl}/subscribe`, { path })
      } else subCallbacks[path].push(ref)
      // return a fucntion
      // to remove our new sub from
      // the table
      return () => {
        subCallbacks[path] = subCallbacks[path].filter(k => k.id !== id)
      }
    },
    write,
    read,
    async remove(path: string) {
      write(path, null)
    }
  }
}
