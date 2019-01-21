export interface Context {
  httpPort: number;
  wsPort: number;
  logger: (e: any) => any;
}
