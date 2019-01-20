export interface DatabaseInterface {
  /**
   * Init the database with state
   * stored in the cache file.
   *
   * Calling init is not mandatory,
   * but is required for any form
   * of non-volatile storage
   */
  init(): Promise<void>;

  /**
   * Read data from the "node" described by path
   * where path uses "/" to separate nodes
   *
   * null is returned if there is no data
   * at path
   */
  read(path: string): Promise<Object>;

  /**
   * Subscribe to all data changes at path
   */
  subscribe(path: string, callback: (e: any) => any): () => any;

  /**
   * Write data to the node described by path
   * where path once again uses "/" separate nodes
   *
   * toWrite can be any plain JavaScript object
   * (e.g anything that can be serialized with JSON.stringify)
   *
   * An exception is thrown if the write fails
   */
  write(path: string, toWrite: Object): Promise<void>;

  /**
   * Remove data at path
   */
  remove(path: string): Promise<void>;

  /**
   * Empty the database
   */
  flush(): Promise<void>;

  /**
   * String representation (JSON) of the database
   */
  toString(): Object;
}
