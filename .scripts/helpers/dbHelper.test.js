const td = require('testdouble')
const DbHelper = require('./dbHelper')

describe('DbHelper', () => {
  describe('constructor', function () {
    it('should set `MongoClient` when `MongoClient` param is pased', () => {
      const MongoClient = td.object()

      const dbHelper = new DbHelper(MongoClient)

      expect(dbHelper.MongoClient).not.toBeUndefined()
    })
    it('should set `baseMongoUrl` when `baseMongoUrl` param is passed', () => {
      const MongoClient = td.object()
      const baseMongoUrl = 'my-mongo-url'

      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)

      expect(dbHelper.baseMongoUrl).toEqual(baseMongoUrl)
    })
    it('should set `baseMongoUrl` from system env `BASE_STAGING_MONGOURL` when no `baseMongoUrl` param is passwd', () => {
      const MongoClient = td.object()
      const baseMongoUrl = 'my-mongo-url'
      process.env.BASE_STAGING_MONGOURL = baseMongoUrl

      const dbHelper = new DbHelper(MongoClient)

      expect(dbHelper.baseMongoUrl).toEqual(baseMongoUrl)
    })
    it('should set `db` variable to `undefined`', () => {
      const MongoClient = td.object()
      const dbHelper = new DbHelper(MongoClient)

      expect(dbHelper.db).toBeUndefined()
    })
  })
  describe('isMonguUrlExist', () => {
    it('should return true when `baseMonguUrl` is set', () => {
      const MongoClient = td.object()
      const dbHelper = new DbHelper(MongoClient, 'mongo-url')

      expect(dbHelper.isMongoUrlExist()).toEqual(true)
    })
    it('should return false when `baseMonguUrl` is not set', () => {
      const MongoClient = td.object()
      process.env.BASE_STAGING_MONGOURL = undefined
      const dbHelper = new DbHelper(MongoClient)

      expect(dbHelper.isMongoUrlExist()).toEqual(false)
    })
  })
  describe('connectToDatabase', () => {
    it('should connect do database', async () => {
      const baseMongoUrl = 'mongo-url'
      const MongoClient = td.object({
        connect: td.function()
      })
      td.when(MongoClient.connect(td.matchers.anything())).thenResolve({})
      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)

      await dbHelper.connectToDatabase('branchVersionLabel')

      expect(dbHelper.db).toEqual({})
    })
  })
  describe('dropDatabase', () => {
    it('should drop database', async () => {
      const baseMongoUrl = 'mongo-url'
      const branchVersionLabel = 'branchVersionLabel'
      const MongoClient = td.object({
        connect: td.function()
      })
      const db = td.object({
        db: td.function()
      })
      const database = td.object({
        dropDatabase: td.function()
      })
      td.when(MongoClient.connect(td.matchers.anything())).thenResolve(db)
      td.when(db.db(branchVersionLabel)).thenResolve(database)
      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)
      await dbHelper.connectToDatabase(branchVersionLabel)

      await dbHelper.dropDatabase(branchVersionLabel)

      td.verify(database.dropDatabase())
    })
  })
  describe('closeDbConnection', () => {
    it('should connection to database', async () => {
      const baseMongoUrl = 'mongo-url'
      const MongoClient = td.object({
        connect: td.function()
      })
      const db = td.object({
        close: td.function()
      })
      td.when(MongoClient.connect(td.matchers.anything())).thenResolve(db)
      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)
      await dbHelper.connectToDatabase('branchVersionLabel')

      await dbHelper.closeDbConnection()

      expect(dbHelper.db).toBeUndefined()
    })
  })
  describe('isConnectedToDb', () => {
    it('should return true when connection to database is established', async () => {
      const baseMongoUrl = 'mongo-url'
      const MongoClient = td.object({
        connect: td.function()
      })
      td.when(MongoClient.connect(td.matchers.anything())).thenResolve({})
      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)

      await dbHelper.connectToDatabase('branchVersionLabel')

      expect(dbHelper.isConnectedToDb()).toEqual(true)
    })
    it('should return false when there is no connection to database', async () => {
      const baseMongoUrl = 'mongo-url'
      const MongoClient = td.object({
        connect: td.function()
      })
      td.when(MongoClient.connect(td.matchers.anything())).thenResolve(undefined)
      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)

      await dbHelper.connectToDatabase('branchVersionLabel')

      expect(dbHelper.isConnectedToDb()).toEqual(false)
    })
  })
  describe('getMongoUrl', () => {
    it('should return return proper mongo url based on `branchVersionLabel` param', () => {
      const MongoClient = td.object()
      const baseMongoUrl = 'mongodb://user:pass@host:27017/${MY_DB_NAME}?ssl=true'
      const branchVersionLabel = 'my-branch-version-label'
      const expectedMongoUrl = 'mongodb://user:pass@host:27017/my-branch-version-label?ssl=true'
      const dbHelper = new DbHelper(MongoClient, baseMongoUrl)

      expect(dbHelper.getMongoUrl(branchVersionLabel)).toEqual(expectedMongoUrl)
    })
  })
})
