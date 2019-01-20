export interface Context {
  logger: (e: any) => void;
  cachePath: string;
  maxDbSizeMB: number;
}
