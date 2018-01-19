// @flow

import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import OpticsAgent from 'optics-agent'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import passport from 'passport'
import session from 'express-session'
import schedule from 'node-schedule'
import cors from 'cors'
import schema from './api/schema'
import { usersRepository } from './api/repositories/UsersRepository'

const app = express()

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

app.use(session({
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

let OPTICS_API_KEY = process.env.OPTICS_API_KEY

// FIXES CORS ERROR
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
    // console.log('Gozdecki: origin', origin)
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1 || !origin
    // console.log('Gozdecki: originIsWhitelisted', originIsWhitelisted)
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
      console.log('Gozdecki: correct')
      res.redirect('/')
    }
)

OpticsAgent.configureAgent({ apiKey: OPTICS_API_KEY })

OpticsAgent.instrumentSchema(schema)

if (OPTICS_API_KEY) {
  app.use('/graphql', OpticsAgent.middleware())
}

app.use('/graphql', graphqlExpress((req) => {
    // Get the query, the same way express-graphql does it
    // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query
  if (query && query.length > 2000) {
        // None of our app's queries are this long
        // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.')
  }
  // console.log('Gozdecki: req.user in graphql', req.user)
    // let user;
    // if (req.user) {
    //     // We get req.user from passport-github with some pretty oddly named fields,
    //     // let's convert that to the fields in our schema, which match the GitHub
    //     // API field names.
    //     user = {
    //         login: req.user.username,
    //         html_url: req.user.profileUrl,
    //         avatar_url: req.user.photos[0].value,
    //     };
    // }

  let opticsContext
  if (OPTICS_API_KEY) {
    opticsContext = OpticsAgent.context(req)
  }

  return {
    schema,
    context: {
      opticsContext,
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

const server = createServer(app)
const port = process.env.PORT || 8080

server.listen(port, undefined, undefined, () => console.log( // eslint-disable-line no-console
    `API Server is now running on http://localhost:${port}/graphql`
))
