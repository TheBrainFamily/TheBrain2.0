// @flow
import * as MongoClient from 'mongodb'
import type { Db } from 'mongodb'

const dbURI = 'mongodb://localhost/thebrain'
const testingDBURI = 'mongodb://localhost/testing'
let resolvedDBURI = ''

let collectionInitQueue = []
let dbInstance = null

switch (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()) {
  case 'TESTING':
    resolvedDBURI = testingDBURI
    break
  case 'PRODUCTION':
    resolvedDBURI = process.env.MONGOURL
    break
  case 'STAGING':
    resolvedDBURI = process.env.STAGING_MONGOURL
    break
  case 'DEVELOPMENT':
  default:
    resolvedDBURI = dbURI
    break
}

export { resolvedDBURI }

export async function dbConnector (cachedDb) {
  if (cachedDb && cachedDb.serverConfig.isConnected()) {
    console.log('=> using cached database instance')
    return Promise.resolve(cachedDb)
  }

  let db
  try {
    db = await MongoClient.connect(resolvedDBURI)
  } catch (e) {
    console.log(e)
  }
  console.log('connected', new Date())
  dbInstance = db
  collectionInitQueue.forEach(collectionInitCallback => collectionInitCallback())
  return db
}

let dbConnectionPromise
export class MongoRepository {
  db: Db

  constructor () {
    if (dbInstance) {
      this.db = dbInstance
      this.init()
    } else {
      collectionInitQueue.push(() => {
        this.db = dbInstance
        this.init()
      })
    }
  }

  init () {
    throw Error('Not yet implemented')
  }
}

export {dbConnectionPromise}
