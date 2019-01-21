import { runServer } from "./server";
import process from "process";

// we test the server using the client
import { dbFactory, DatabaseConnection } from "naive-client";

const port = +(process.env.PORT || 5000);
const httpPort = port;
const wsPort = port + 1;

describe("Server module", async () => {
  let db: DatabaseConnection;
  beforeAll(async () => {
    await runServer({
      httpPort,
      wsPort,
      logger: console.log
    });
    db = dbFactory({ httpPort, wsPort, url: "localhost" });
    await db.init();
  });
  test("it should work", async () => {
    await db.write("/hello/world", {
      my: "data"
    });
  });
});
