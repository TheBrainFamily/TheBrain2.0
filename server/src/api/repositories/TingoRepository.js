// @flow
const collection = require('tingodb-promise')

export class MongoRepository {
  db: any

  constructor () {
    this.db = { collection }
    this.init()
  }

  init () {
    throw Error('Not yet implemented')
  }
}
