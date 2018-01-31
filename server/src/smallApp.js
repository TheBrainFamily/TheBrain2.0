import express from 'express'
import { dbConnectionPromise, dbConnector, resolvedDBURI } from './api/repositories/MongoRepository'
import session from 'express-session'
import passport from 'passport'
import schedule from 'node-schedule'
import cors from 'cors'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express/dist/index'
import schema from './api/graphql/schema'
import bodyParser from 'body-parser'
import { usersRepository } from './api/repositories/UsersRepository'

const createApp = async function () {
  await dbConnector()
  await dbConnectionPromise
  const app = express()
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))

  const MongoStore = require('connect-mongo')(session)
  app.use(session({
    store: resolvedDBURI && new MongoStore({url: resolvedDBURI}),
    secret: process.env.SESSION_SECRET || 'development secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  const whitelist = [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:9000',
    'http://localhost:3040',
    'http://new.thebrain.pro',
    'https://new.thebrain.pro',
    'http://thebrain.pro',
    'https://thebrain.pro',
    'http://sleepy-stream-93575.herokuapp.com',
    'https://sleepy-stream-93575.herokuapp.com',
    'https://stark-badlands-16845.herokuapp.com',
    'https://stark-badlands-16845.herokuapp.com'
  ]

  const corsOptions = {
    origin: function (origin, callback) {
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1 || !origin
      callback(null, originIsWhitelisted)
    },
    credentials: true
  }

  app.use(cors(corsOptions))
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function (req, res) {
      console.log('starting facebook authentication')
    })
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/'}),
    function (req, res) {
      res.redirect('/')
    }
  )

  app.use('/graphql', graphqlExpress((req) => {
    // Get the query, the same way express-graphql does it
    // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
    const query = req.query.query || req.body.query
    if (query && query.length > 2000) {
      // None of our app's queries are this long
      // Probably indicates someone trying to send an overly expensive query
      throw new Error('Query too large.')
    }
    return {
      schema,
      context: {
        user: req.user,
        req
      }
    }
  }))
  app.get('/helloWorld', (req, res) => res.send('Hello World!'))

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
  schedule.scheduleJob('0 0 * * *', async () => {
    await usersRepository.removeExpiredTokens()
  })
  app.get('/', (req, res) => {
    console.log('main')
    res.send('Hello World!')
  })

  app.get('/hello', (req, res) => {
    console.log('not main')
    res.send('Hello World New!')
  })
  return app
}
export {createApp}
