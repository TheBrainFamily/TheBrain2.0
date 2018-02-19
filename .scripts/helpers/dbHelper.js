class DbHelper {
  constructor (MongoClient, baseMongoUrl) {
    this.MongoClient = MongoClient
    this.baseMongoUrl = baseMongoUrl || process.env.BASE_STAGING_MONGOURL
    this.db = undefined
  }

  isMongoUrlExist () {
    return this.baseMongoUrl !== undefined && this.baseMongoUrl !== ''
  }

  isConnectedToDb () {
    return this.db !== undefined
  }

  getMongoUrl (branchVersionLabel) {
    return this.baseMongoUrl.replace('${MY_DB_NAME}', branchVersionLabel)
  }

  async connectToDatabase (branchVersionLabel) {
    const mongoUrl = this.getMongoUrl(branchVersionLabel)
    this.db = await this.MongoClient.connect(mongoUrl)
  }

  async dropDatabase (branchVersionLabel) {
    const database = await this.db.db(branchVersionLabel)
    await database.dropDatabase()
  }

  async closeDbConnection () {
    await this.db.close()
    this.db = undefined
  }
}

module.exports = DbHelper
