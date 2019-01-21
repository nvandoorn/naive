import { Config } from "./config.model";
import { DatabaseConnection } from "./database-connection.model";

/**
 * Client side implementation is implemented using
 * a function/factory instead of a class to reduce bundle
 * size
 */
export const dbFactory = (config: Config): DatabaseConnection => {
  const write = (path: string, toWrite: Object | null) => {
    const { url, httpPort } = config;
    return fetch(`${url}:${httpPort}/write`, {
      method: "POST",
      body: JSON.stringify({
        path,
        toWrite
      })
    });
  };
  return {
    async init() {},
    async close() {},
    async subscribe(path: string, callback: (e: any) => Promise<any>) {
      return () => {};
    },
    write,
    async remove(path: string) {
      write(path, null);
    }
  };
};
