import { Database } from "./database";

describe("Database module", () => {
  const mockCtx = {
    config: {
      email: "hello@co.co",
      inactivityPeriodSeconds: 60
    },
    env: {
      GITHUB_API_KEY: "",
      MAIL_API_KEY: ""
    },
    logger: console.log
  };
  let db: Database;
  beforeAll(async () => {
    db = new Database(mockCtx);
    await db.init();
  });
  // Next 2 tests simply look
  // for expections on operations that
  // should be harmless
  test("it should write data", () => {
    return db.write("/hello/world", {
      formula: "hello world"
    });
  });
  test("it should fetch data", () => {
    return db.fetch("/hello/world");
  });
  test("it should have a string representation", () => {
    expect(db.toString()).not.toHaveLength(0);
  });
  test("it should write and then fetch data", async () => {
    const path = "/hello/world";
    const toWrite = {
      secret: "stuff"
    };
    await db.write(path, toWrite);
    const s = await db.fetch(path);
    expect(s).toBe(toWrite);
  });
  test("it should be empty after a flush", async () => {
    await db.write("/hello/world", {
      my: "object"
    });
    await db.flush();
    expect(db.toString()).toHaveLength(2); // empty object
  });
  test("it should fetch null on an empty node", async () => {
    await db.flush();
    const s = await db.fetch("/any/path/should/work");
    expect(s).toBeNull();
  });
  test("it should not change on fetch", async () => {
    await db.flush();
    await db.write("/my/data/lives/here", {
      whiteHouseDinner: `America's Finest McDouble's`
    });
    const before = db.toString();
    const s = await db.fetch("/no/data/here/silly");
    expect(s).toBeNull();
    expect(before).toEqual(db.toString());
  });
});
