// @flow
import * as MongoClient from 'mongodb'

const dbURI = 'mongodb://localhost/thebrain'
const productionDBURI = 'mongodb://localhost/thebrain'
const testingDBURI = 'mongodb://localhost/testing'
let resolvedDBURI = ''

let collectionInitQueue = []
let connectingToDb = false
let dbInstance = null

switch (process.env.NODE_ENV) {
  case 'TESTING':
    resolvedDBURI = testingDBURI
    break
  case 'PRODUCTION':
    resolvedDBURI = productionDBURI
    break
  case 'DEVELOPMENT':
  default:
    resolvedDBURI = dbURI
    break
}

export class MongoRepository {
  db: any

  constructor () {
    if (connectingToDb === false) {
      connectingToDb = true
      MongoClient.connect(resolvedDBURI, (error, db) => {
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