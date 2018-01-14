// @flow
import * as MongoClient from 'mongodb'
import type { Db } from 'mongodb'

const dbURI = 'mongodb://localhost/thebrain'
const testingDBURI = 'mongodb://localhost/testing'
let resolvedDBURI = ''

let collectionInitQueue = []
let connectingToDb = false
let dbInstance = null

switch (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase()) {
  case 'TESTING':
    resolvedDBURI = testingDBURI
    break
  case 'PRODUCTION':
    resolvedDBURI = process.env.MONGOURL
    break
  case 'DEVELOPMENT':
  default:
    resolvedDBURI = dbURI
    break
}

export class MongoRepository {
  db: Db

  constructor () {
    if (connectingToDb === false) {
      connectingToDb = true
      MongoClient.connect(resolvedDBURI, (error, db) => {
        if (error) {
          throw new Error(error)
        }
        dbInstance = db
        collectionInitQueue.forEach(collectionInitCallback => collectionInitCallback())
      })
    }

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
