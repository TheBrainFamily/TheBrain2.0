const serverless = require('serverless-http')
const { createApp } = require('./app')

let cachedDb = null

module.exports.handler = function (evt, ctx, callback) {
  return createApp(cachedDb).then(({app, db}) => {
    cachedDb = db
    return serverless(app, {callbackWaitsForEmptyEventLoop: false})(evt, ctx, callback)
  })
}
