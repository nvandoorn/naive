export interface DatabaseConnection {
  init(): Promise<any>
  close(): Promise<any>
  subscribe(path: string, callback: (e: any) => any): Promise<() => any>
  write(path: string, toWrite: Object): Promise<any>
  remove(path: string): Promise<any>
}
