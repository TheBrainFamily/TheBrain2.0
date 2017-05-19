// @flow

import mongoose from 'mongoose'
import moment from 'moment'
import bcrypt from 'bcrypt'
import urlencode from 'urlencode'

import getItemsWithFlashcardsByCount from './tools/getItemsWithFlashcardsByCount'

const dbURI = 'mongodb://localhost/thebrain'
const productionDBURI = 'mongodb://localhost/thebrain'
const testingDBURI = 'mongodb://localhost/testing'

switch (process.env.NODE_ENV) {
  case 'TESTING':
    mongoose.connect(testingDBURI)
    break
  case 'PRODUCTION':
    mongoose.connect(productionDBURI)
    break
  case 'DEVELOPMENT':
  default:
    mongoose.connect(dbURI)
    break
}

const FlashcardSchema = new mongoose.Schema({
  question: String,
  answer: String
})

export const Flashcards = mongoose.model('Flashcards', FlashcardSchema)

export class FlashcardsRepository {
  async getFlashcards () {
    console.log('inside code')
    const flashcards = await Flashcards.find().exec()
    console.log('Gozdecki: flashcards', flashcards.length)
    return flashcards
  }

  async getFlashcard (_id: string) {
    console.log('getChannel by ', _id)
    return Flashcards.findOne({_id})
  }

  // This API is currently not used by the app,
  // but it's required for setting up tests
  async insertFlashcard () {

  }
}

const LessonSchema = new mongoose.Schema({
  position: Number,
  description: String,
  flashcardIds: Array,
  youtubeId: String
})

export const Lessons = mongoose.model('Lessons', LessonSchema)

export class LessonsRepository {
  async getLessons () {
    return Lessons.find()
  }

  async getLessonByPosition (position: number) {
    console.log('getChannel by ', position)
    return Lessons.findOne({position})
  }

  async getLessonById (_id: string) {
    // console.log("_id ", _id);
    return Lessons.findOne({_id}).exec()
  }
}

const ItemSchema = new mongoose.Schema({
  flashcardId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  actualTimesRepeated: Number,
  easinessFactor: Number,
  extraRepeatToday: Boolean,
  lastRepetition: Number,
  nextRepetition: Number,
  previousDaysChange: Number,
  timesRepeated: Number
})

export const Items = mongoose.model('Items', ItemSchema)

export class ItemsRepository {
  async getItems (lessonPosition: number) {

  }

  async update (id: string, item: Object, userId: string) {
    return Items.update({_id: id, userId}, {$set: item})
  }

  async getItemById (_id: string, userId: string) {
    return Items.findOne({_id, userId})
  }

  async create (flashcardId: string, userId: string) {
    const newItem = {
      flashcardId,
      userId,
      actualTimesRepeated: 0,
      easinessFactor: 2.5,
      extraRepeatToday: false,
      lastRepetition: 0,
      nextRepetition: 0,
      previousDaysChange: 0,
      timesRepeated: 0
    }
    const item = new Items(newItem)
    const insertedItem = await item.save()
    console.log('insertedItem', insertedItem)
    return newItem
  }
}

export class ItemsWithFlashcardRepository {
  async getItemsWithFlashcard (userId: string) {
    const currentItems = await Items.find({
      userId,
      $or: [
        { actualTimesRepeated: 0 },
        { extraRepeatToday: true },
        { nextRepetition: { $lte: moment().unix() } }
      ]
    })

    const flashcards = await Flashcards.find({_id: {$in: currentItems.map(item => item.flashcardId)}})

    return currentItems.map(item => {
      return {
        item,
        flashcard: flashcards.find(flashcard => flashcard._id.equals(item.flashcardId))
      }
    }).sort((a, b) => {
      return a.item.lastRepetition - b.item.lastRepetition
    })
  }

  async getSessionCount (userId: string) {
    const items = await Items.find({
      userId,
      $or: [
        { actualTimesRepeated: 0 },
        { lastRepetition: { $gte: moment().subtract(3, 'hours').unix() } },
        { nextRepetition: { $lte: moment().unix() } }
      ]
    })

    return getItemsWithFlashcardsByCount(items)
  }
}

const UserDetailsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  nextLessonPosition: Number
})

export const UserDetails = mongoose.model('userDetails', UserDetailsSchema)

export class UserDetailsRepository {
  async create (userId: string) {
    const newUserDetails = new UserDetails({userId, nextLessonPosition: 1})
    await newUserDetails.save()
  }

  async getNextLessonPosition (userId: string) {
    const userDetails = await UserDetails.findOne({userId})
    return userDetails.nextLessonPosition
  }

  async updateNextLessonPosition (userId: string) {
    await UserDetails.update({userId}, {$inc: {nextLessonPosition: 1}})
  }
}

const UserSchema = new mongoose.Schema({
  oauthID: Number,
  // TODO username should be unique but now all new are called guest
  username: String,
  password: String,
  createdAt: Number,
  activated: Boolean,
  facebookId: String,
  resetPasswordToken: String
})

// TODO THIS SHOULD BE TAKEN FROM THE ENV
const SALT_WORK_FACTOR = 1034
const bcryptPassword = async function (next) {
  try {
    const user = this
    if (!user.isModified('password')) {
      return next()
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
    next()
  } catch (e) {
    next(e)
  }
}

UserSchema.pre('save', bcryptPassword)

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const generateResetPasswordToken = async (userId) => {
  const rawToken = `${userId}_W3GojrLkVLKH9l`
  // we are using hashing function as a clean way to generate a random string
  const salt = await bcrypt.genSalt(Math.random())
  return urlencode.encode(await bcrypt.hash(rawToken, salt))
}

export const Users = mongoose.model('users', UserSchema)

export class UsersRepository {
  async createGuest () {
    const newUser = new Users({username: 'guest', password: 'notSet', activated: false, createdAt: moment().unix()})
    const insertedUser = await newUser.save()
    await new UserDetailsRepository().create(insertedUser._id)
    return insertedUser
  }

  async updateUser (userId: string, username: string, password: string) {
    const userToBeUpdated = await Users.findOne({_id: userId})
    userToBeUpdated.username = username
    userToBeUpdated.password = password
    userToBeUpdated.activated = true
    await userToBeUpdated.save()
    // TODO this didn't return anything, need investigation
    return userToBeUpdated
  }

  async updateFacebookUser (userId: string, facebookId: string) {
    const userToBeUpdated = await Users.findOne({_id: userId})
    userToBeUpdated.facebookId = facebookId
    userToBeUpdated.activated = true
    await userToBeUpdated.save()
    return userToBeUpdated
  }

  async findByUsername (username: string) {
    return Users.findOne({username})
  }

  async findByFacebookId (facebookId: string) {
    return Users.findOne({facebookId})
  }

  async resetUserPassword (username: string) {
    const userToBeUpdated = await this.findByUsername(username)
    if (userToBeUpdated) {
      userToBeUpdated.resetPasswordToken = await generateResetPasswordToken(userToBeUpdated._id)
      await userToBeUpdated.save()
      return userToBeUpdated
    } else {
      return null
    }
  }
}
