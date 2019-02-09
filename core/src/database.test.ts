import { Database } from './database'
import { NaiveErrorCode } from '../../lib/error.model'

const generateString = (sizeBytes: number): string =>
  Array(Math.ceil(sizeBytes))
    .fill('a')
    .join('')

const maxDbSizeMB = 0.1

describe('Database module', () => {
  let db: Database

  beforeAll(async () => {
    db = new Database({
      logger: console.log,
      maxDbSizeMB,
      cachePath: `${__dirname}/db.json`
    })
    await db.init()
  })

  beforeEach(async () => {
    await db.flush()
  })

  // Next 2 tests run simple operations
  // that should _not_ throw exceptions
  test('it should write data', () => {
    return db.write('/hello/world', {
      formula: 'hello world'
    })
  })

  test('it should read data', () => {
    return db.read('/hello/world')
  })

  test('it should have a string representation', () => {
    expect(db.toString()).not.toHaveLength(0)
  })

  test('it should write and then read data', async () => {
    const path = '/hello/world'
    const toWrite = {
      secret: 'stuff'
    }
    await db.write(path, toWrite)
    const s = await db.read(path)
    expect(s).toBe(toWrite)
  })

  test('it should write and read data from the root', async () => {
    const toWrite = {
      my: {
        big: {
          fun: 'data'
        }
      }
    }
    await db.write('/', toWrite)
    const s = await db.read('/')
    expect(s).toEqual(toWrite)
  })

  test('it should remove data', async () => {
    const path = '/this/is/fun'
    await db.write(path, {
      foxNews: {
        stories: ['AOC', 'aoc', 'aOC', 'aOc']
      }
    })
    await db.remove(path)
    const s = await db.read(path)
    expect(s).toBeNull()
  })

  test('it should remove data at path & leave other data', async () => {
    const path = '/this/is/fun'

    const buzzFeed = {
      stories: ['hack your dogs brain in 4 easy steps']
    }
    await db.write(path, {
      foxNews: {
        stories: ['AOC', 'aoc', 'aOC', 'aOc']
      },
      buzzFeed
    })
    const appendedPath = `${path}/foxNews`
    await db.remove(appendedPath)
    const buzzFeedOut = await db.read(`${path}/buzzFeed`)
    const foxOut = await db.read(appendedPath)
    expect(buzzFeedOut).toEqual(buzzFeed)
    expect(foxOut).toBeNull()
  })

  test('it should be empty after a flush', async () => {
    await db.write('/hello/world', {
      my: 'object'
    })
    await db.flush()
    expect(db.toString()).toHaveLength(2) // empty object
  })

  test('it should read null on an empty node', async () => {
    const s = await db.read('/any/path/should/work')
    expect(s).toBeNull()
  })

  test('it should not change on read', async () => {
    await db.write('/my/data/lives/here', {
      whiteHouseDinner: `America's Finest McDouble's`
    })
    const before = db.toString()
    const s = await db.read('/no/data/here/silly')
    expect(s).toBeNull()
    expect(before).toEqual(db.toString())
  })

  test('it should throw an error if max size is exceeded', async () => {
    try {
      await db.write('/big/data', {
        bigObj: generateString(maxDbSizeMB * 1024 ** 2)
      })
      throw new Error('Did not throw exception')
    } catch (e) {
      expect(e.code).toBe(NaiveErrorCode.OUT_OF_SPACE)
    }
  })
})
