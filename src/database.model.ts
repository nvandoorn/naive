export interface DatabaseInterface {
  init(): Promise<void>;
  read(path: string): Promise<Object>;
  write(path: string, toWrite: Object): Promise<void>;
  flush(): Promise<void>;
  toString(): Object;
}
