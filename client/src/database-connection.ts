import { Config } from './config.model'
import { DatabaseConnection } from './database-connection.model'

const IS_NODE = true

/**
 * Client side implementation is implemented using
 * a function/factory instead of a class to reduce bundle
 * size
 */
export const dbFactory = (config: Config): DatabaseConnection => {
  // TODO figure out how to patch
  // in native fetch instead
  // when this is running in the browser
  const send = require('node-fetch')
  const write = (path: string, toWrite: Object | null) => {
    const { httpUrl } = config
    const body = JSON.stringify({
      path,
      toWrite
    })
    return send(`${httpUrl}/write`, {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }
  return {
    async init() {},
    async close() {},
    async subscribe(path: string, callback: (e: any) => Promise<any>) {
      return () => {}
    },
    write,
    async remove(path: string) {
      write(path, null)
    }
  }
}
