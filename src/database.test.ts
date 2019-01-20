import { Database } from "./database";

describe("Database module", () => {
  let db: Database;
  beforeAll(async () => {
    db = new Database();
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
  test("it should read data", () => {
    return db.read("/hello/world");
  });
  test("it should have a string representation", () => {
    expect(db.toString()).not.toHaveLength(0);
  });
  test("it should write and then read data", async () => {
    const path = "/hello/world";
    const toWrite = {
      secret: "stuff"
    };
    await db.write(path, toWrite);
    const s = await db.read(path);
    expect(s).toBe(toWrite);
  });
  test("it should be empty after a flush", async () => {
    await db.write("/hello/world", {
      my: "object"
    });
    await db.flush();
    expect(db.toString()).toHaveLength(2); // empty object
  });
  test("it should read null on an empty node", async () => {
    await db.flush();
    const s = await db.read("/any/path/should/work");
    expect(s).toBeNull();
  });
  test("it should not change on read", async () => {
    await db.flush();
    await db.write("/my/data/lives/here", {
      whiteHouseDinner: `America's Finest McDouble's`
    });
    const before = db.toString();
    const s = await db.read("/no/data/here/silly");
    expect(s).toBeNull();
    expect(before).toEqual(db.toString());
  });
});
