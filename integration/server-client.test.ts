import { runServer } from '../server/src/server'
import process from 'process'

// We test the server using the client.
// It would be better to import this
// from a linked npm package,
// but that requires rebuilding each time
// so fuck it for now
import { dbFactory, DatabaseConnection } from '../client/src'

const port = +(process.env.PORT || 5005)
const httpPort = port
const wsPort = port + 1
const localHost = 'http://localhost:'

describe('Server module', async () => {
  let db: DatabaseConnection
  let cleanup: () => Promise<void>
  beforeAll(async () => {
    cleanup = await runServer({
      httpPort,
      wsPort,
      logger: console.log
    })
    db = dbFactory({
      wsUrl: `${localHost}${wsPort}`,
      httpUrl: `${localHost}${httpPort}`
    })
    await db.init()
  })
  afterAll(async () => {
    if (cleanup) {
      await cleanup()
    }
  })
  test('it should leave input data unchaged', async () => {
    const path = '/hello/world'
    const fixture = {
      my: 'data'
    }
    await db.write(path, fixture)
    const r = await db.read(path)
    expect(r).toMatchObject(fixture)
  })
  test('it should get data in realtime', () => {
    return new Promise(async resolve => {
      db.subscribe('/hello/world', (data: any) => {
        resolve(data)
      })
      await db.write('/hello/world', { data: 5 })
    })
  })
})
