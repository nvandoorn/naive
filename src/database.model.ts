export interface DatabaseInterface {
  init(): Promise<void>;
  fetch(path: string): Promise<Object>;
  write(path: string, toWrite: Object): Promise<void>;
  flush(): Promise<void>;
  toString(): Object;
}
