import { runServer } from "./server";
import process from "process";

// We test the server using the client.
// It would be better to import this
// from a linked npm package,
// but that requires rebuilding each time
// so fuck it for now
import { dbFactory, DatabaseConnection } from "../../client/src";

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
