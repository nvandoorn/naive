export interface Context {
  /**
   * Method used to log.
   *
   * console.log is usually supplied
   * but it may be handy to pipe it elsewhere
   * later
   */
  logger: (e: any) => void;
  /**
   * Location of the database cache file (JSON file)
   */
  cachePath: string;
  /**
   * Maximum database size in megabytes
   */
  maxDbSizeMB: number;
}
