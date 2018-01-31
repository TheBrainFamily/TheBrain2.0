// @flow

import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import bodyParser from 'body-parser'
import passport from 'passport'
import session from 'express-session'
import schedule from 'node-schedule'
import cors from 'cors'
import schema from './api/graphql/schema'
import { usersRepository } from './api/repositories/UsersRepository'
import {resolvedDBURI, dbConnector, dbConnectionPromise} from './api/repositories/MongoRepository'

const createApp = async function (cachedDb) {
  const db = await dbConnector(cachedDb)
  await dbConnectionPromise
  const app = express()

  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))

  const MongoStore = require('connect-mongo')(session)
  app.use(session({
    store: resolvedDBURI && new MongoStore({db}),
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

// FIXES CORS ERROR - LEAVING THIS AND THE LOGIC IN corsOption commented out
// so if you need to block other domains, you have an example
//   const whitelist = [
//     'http://localhost:3000',
//     'http://localhost:4000',
//     'http://thebrain.pro',
//     'https://thebrain.pro'
//   ]

  const corsOptions = {
    origin: function (origin, callback) {
      // var originIsWhitelisted = whitelist.indexOf(origin) !== -1 || !origin
      // callback(null, originIsWhitelisted)
      callback(null, true)
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

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
// run scheduled job every at 0:00 every day
  schedule.scheduleJob('0 0 * * *', async () => {
    await usersRepository.removeExpiredTokens()
  })
  return {app, db}
}

export {createApp}
