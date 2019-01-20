import { writeFile, readFile } from "fs";
import { promisify } from "util";

import { DatabaseInterface } from "./database.model";
import { Context } from "./context.model";

import { last } from "./util";

const splitPath = (path: string): string[] => path.split("/").filter(k => k);

const write = promisify(writeFile);
const read = promisify(readFile);

export const DB_CACHE_PATH = `${__dirname}/db.json`;

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
  private buff: any = {};
  constructor(private ctx: Context = { logger: console.log }) {}

  async init(): Promise<void> {
    try {
      const buff = await read(DB_CACHE_PATH);
      this.buff = JSON.parse(buff.toString());
    } catch (e) {
      this.ctx.logger("Failed to init database, using empty object");
      this.ctx.logger(e);
    }
  }

  // this currently runs synchronously,
  // but only because we hold the entire DB in memory
  // (which obviously becomes a bad idea at some point)
  async read(path: string): Promise<Object> {
    const pathParts = splitPath(path);
    return this.resolve(pathParts);
  }

  async write(path: string, toWrite: Object): Promise<void> {
    const pathParts = splitPath(path);
    const writeTo = this.resolve(pathParts, false, 1);
    writeTo[last(pathParts)] = toWrite;
    await this.serialize();
  }

  async flush(): Promise<void> {
    this.buff = {};
    await this.serialize();
  }

  toString() {
    return JSON.stringify(this.buff);
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
    // start at the root of our buffer
    let lastNode = this.buff;
    let node;
    for (let i = 0; i < pathParts.length - level; i++) {
      const part: string = pathParts[i];
      // handle null node
      if (!lastNode[part]) {
        // if we're reading from the object
        // we want to stop as soon
        // as we hit a null node
        if (isRead) {
          return null;
        }
        // but if we're writing and the node is missing,
        // we should make it and continue
        else {
          lastNode[part] = {};
        }
      }
      // traverse to the next node
      node = lastNode[part];
      lastNode = node;
    }
    return node;
  }

  private serialize(): Promise<void> {
    return write(DB_CACHE_PATH, this.toString());
  }
}
