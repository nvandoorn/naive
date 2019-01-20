export interface ChangeHandlers {
  [handlerKey: string]: {
    path: string;
    callback: (e: any) => Promise<any>;
  };
}
