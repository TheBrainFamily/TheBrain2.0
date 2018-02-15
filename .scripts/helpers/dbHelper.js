class dbHelper {
  constructor () {
    this.db = undefined
  }

  isMongoUrlExist () {
    return this.baseMongoUrl !== undefined && this.baseMongoUrl !== ''
  }

  async connectToDatabase (branchVersionLabel) {
    const mongoUrl = this.baseMongoUrl.replace('${MY_DB_NAME}', branchVersionLabel)
    this.db = await MongoClient.connect(mongoUrl)
  }

  async dropDatabase (branchVersionLabel) {
    const database = await this.db.db(branchVersionLabel)
    await database.dropDatabase()
  }

  async closeDbConnection () {
    await this.db.close()
    this.db = undefined
  }

  isConnectedToDb () {
    return this.db !== undefined
  }
}

module.exports = dbHelper
