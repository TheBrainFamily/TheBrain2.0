// @flow

import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import OpticsAgent from 'optics-agent'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import session from 'express-session'

import cors from 'cors'

import schema from './api/schema'

import facebookConfig from './configuration/facebook'
import { flashcardRepository } from './api/repositories/FlashcardsRepository'
import {
  itemsWithFlashcardRepository
} from './api/repositories/ItemsWithFlashcardRepository'
import { itemsRepository } from './api/repositories/ItemsRepository'
import { coursesRepository } from './api/repositories/CoursesRepository'
import { lessonsRepository } from './api/repositories/LessonsRepository'
import { achievementsRepository } from './api/repositories/AchievementsRepository'
import { userDetailsRepository } from './api/repositories/UserDetailsRepository'
import { usersRepository } from './api/repositories/UsersRepository'

const app = express()
const port = 8080

passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((obj, cb) => cb(null, obj))

passport.use(new FacebookStrategy({
  clientID: facebookConfig.clientID,
  clientSecret: facebookConfig.clientSecret,
  callbackURL: facebookConfig.callbackURL
},
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        console.log('Gozdecki: profile', profile)
        return done(null, profile)
      })
    }
))

app.use(session({
    // TODO this should come from the environment settings
  secret: '***REMOVED***',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

let OPTICS_API_KEY

// FIXES CORS ERROR
const whitelist = [
  'http://localhost:3000',
  'http://localhost:3040',
  'http://new.thebrain.pro',
  'https://new.thebrain.pro'
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
      req,
      Flashcards: flashcardRepository,
      Courses: coursesRepository,
      Lessons: lessonsRepository,
      Items: itemsRepository,
      ItemsWithFlashcard: itemsWithFlashcardRepository,
      UserDetails: userDetailsRepository,
      Users: usersRepository,
      Achievements: achievementsRepository,
    }
  }
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

const server = createServer(app)

server.listen(port, undefined, undefined, () => console.log( // eslint-disable-line no-console
    `API Server is now running on http://localhost:${port}/graphql`
))
