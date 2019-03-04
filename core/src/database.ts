import { writeFile, readFile } from 'fs'
import { promisify } from 'util'

import { DatabaseInterface } from './database.model'
import { Context } from './context.model'
import { NaiveError, NaiveErrorCode as e } from '../../lib/error.model'
import { ChangeHandlers } from './change-handlers.model'

import { last, getKey } from '../../lib/util'
import { isRootNode, splitPath, isChildOrMatch } from '../../lib/path'

const write = promisify(writeFile)
const read = promisify(readFile)

export const DEFAULT_CTX = {
  logger: console.log,
  cachePath: `${__dirname}/db.json`,
  maxDbSizeMB: 6
}

/**
 * Implementation of NoSQL DB that uses paths and objects.
 *
 * See DatabaseInterface for docs on public API
 *
 * Uses a plain object as a buffer and reads/writes to a
 * plain JSON file. A better implementation could be backed
 * by somethig a little nicer and not hold the buffer
 * in memory
 */
export class Database implements DatabaseInterface {
  /**
   * In memory buffer to read/write data
   */
  private buff: any = {}
  /**
   * An array of callback functions that are alerted
   * when the database changes (mostly want to use this
   * for some type of pubsub functionality on-top)
   */
  private changeHandlers: ChangeHandlers = {}
  constructor(private ctx: Context = DEFAULT_CTX) {}

  async init(): Promise<void> {
    try {
      const buff = await read(this.ctx.cachePath)
      this.buff = JSON.parse(buff.toString())
    } catch (e) {
      this.ctx.logger('Failed to init database, using empty object')
      this.ctx.logger(e)
    }
  }

  // this currently runs synchronously,
  // but only because we hold the entire DB in memory
  // (which obviously becomes a bad idea at some point)
  async read(path: string): Promise<Object> {
    // root node case
    if (isRootNode(path)) return this.buff
    const pathParts = splitPath(path)
    return this.resolve(pathParts)
  }

  async write(path: string, toWrite: any): Promise<void> {
    let toSet
    if (isRootNode(path)) {
      this.buff = toWrite
      toSet = toWrite
    } else {
      const pathParts = splitPath(path)
      const key = last(pathParts)
      const writeTo = this.resolve(pathParts, false, 1)
      const prev = writeTo[key]
      toSet = { ...prev, ...toWrite }
      writeTo[key] = toSet
    }
    await this.serialize()
    // alert everyone of our new change
    await this.runChangeHandlers(path, toSet)
  }

  private async runChangeHandlers(path: string, change: any): Promise<void> {
    const handlers = Object.values(this.changeHandlers)
    for (let handler of handlers) {
      if (isChildOrMatch(path, handler.path)) {
        await handler.callback(change)
      }
    }
  }

  subscribe(path: string, callback: (e: any) => Promise<any>): () => any {
    const key = getKey('subscriber')
    this.changeHandlers[key] = {
      path,
      callback
    }
    return () => this.unsubscribe(key)
  }

  private unsubscribe(key: string) {
    delete this.changeHandlers[key]
  }

  remove(path: string): Promise<void> {
    return this.write(path, null)
  }

  async flush(): Promise<void> {
    this.buff = {}
    await this.serialize()
  }

  toString() {
    return JSON.stringify(this.buff)
  }

  /**
   * Resolve the object located at path.
   *
   * If isRead == true, no new nodes will
   * be created, and the function will return
   * null if a null node is encountered on the path.
   * Else, we create each node on the path.
   *
   * Level is used to determine how deep
   * to recurse on path. Callers interested in
   * writing may wish to stop higher up the tree.
   */
  private resolve(
    pathParts: string[],
    isRead: boolean = true,
    level: number = 0
  ): any {
    const [firstPart] = pathParts
    if (isRootNode(firstPart)) return this.buff
    const n = pathParts.length - level
    // TODO avoid having to pull
    // this specific case out
    if (n === 0) {
      if (!this.buff[firstPart]) {
        this.buff[firstPart] = {}
        return this.buff[firstPart]
      }
    }
    // start at the root of our buffer
    let lastNode = this.buff
    let node
    for (let i = 0; i < n; i++) {
      const part: string = pathParts[i]
      // handle null node
      if (!lastNode[part]) {
        // if we're reading from the object
        // we want to stop as soon
        // as we hit a null node
        if (isRead) {
          return null
        }
        // but if we're writing and the node is missing,
        // we should make it and continue
        else {
          lastNode[part] = {}
        }
      }
      // traverse to the next node
      node = lastNode[part]
      lastNode = node
    }
    return node
  }

  /**
   * Serialize the current buffer
   * into a plain file.
   *
   * Change the path by injecting custom
   * Context
   *
   * Throws OUT_OF_SPACE
   */
  private serialize(): Promise<void> {
    if (!this.hasSpace()) throw new NaiveError(e.OUT_OF_SPACE)
    return write(this.ctx.cachePath, this.toString())
  }

  private hasSpace(): boolean {
    // convert from MB to B
    return this.toString().length <= this.ctx.maxDbSizeMB * 1024 ** 2
  }
}
