import { runServer } from "../src/server";
import process from "process";

const port = +(process.env.PORT || 5000);

runServer({
  httpPort: port,
  wsPort: port + 1,
  logger: console.log
});
