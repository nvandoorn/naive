import { Context } from "./context.model";
import { bindOperations } from "./operations";
import { DatabaseChange } from "../../lib/database-change.model";
import WebSocket from "ws";

import { Database, Context as CoreContext } from "naive-core";

export const runServer = async (ctx: Context) => {
  const db = new Database();
  await db.init();
  const wss = new WebSocket.Server({ port: ctx.wsPort });

  bindOperations(ctx, db, async (dbChange: DatabaseChange) => {
    for (let client of wss.clients) {
      client.send(dbChange);
    }
  });
};
