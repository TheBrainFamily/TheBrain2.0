// @flow
import * as MongoClient from 'mongodb'

const dbURI = 'mongodb://localhost/thebrain'
const productionDBURI = 'mongodb://localhost/thebrain'
const testingDBURI = 'mongodb://localhost/testing'
let resolvedDBURI = ''

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

    console.log("JMOZGAWA: resolvedDBURI",resolvedDBURI);

    MongoClient.connect(resolvedDBURI, (error, db) => {
      this.db = db
      this.init()
    })
  }

  init () {
    throw Error('Not yet implemented')
  }
}