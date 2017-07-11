// @flow

import _ from 'lodash'
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

const CourseSchema = new mongoose.Schema({
  name: String,
  color: String
})

export const Courses = mongoose.model('Courses', CourseSchema)

export class CoursesRepository {
  async getCourses () {
    return Courses.find()
  }

  async getCourse (_id: string) {
    return Courses.findOne({_id})
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
  async getLessons (courseId: string) {
    return Lessons.find({courseId}).sort({position: 1});
  }

  async getLessonCount () {
    return { count: await Lessons.count().exec() }
  }

  async getCourseLessonByPosition (courseId: string, position: number) {
    return Lessons.findOne({ courseId, position })
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

const ProgressSchema = new mongoose.Schema({
  courseId: String,
  lesson: Number
})

const AchievementDefSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  targetValue: Number,
  formula: Object,          // {simple:'watchedMovies'} || TODO: {complex: {}}
  active: Boolean,
  sortOrder: Number,
})

export const Achievements = mongoose.model('achievementDefinitions', AchievementDefSchema)
export class AchievementsRepository {
  async getUserAchievements (userDetails) {
    const achievementDefinitions = await Achievements.find()
    const previousAchievementIds = new Set((userDetails.collectedAchievements || []).map(achievementId => achievementId.toString()))
    const userAchievements = []

    achievementDefinitions.forEach(achievementDef => {
      let value = 0

      if (achievementDef.formula.simple && userDetails.achievementStats[achievementDef.formula.simple]) {
        value = userDetails.achievementStats[achievementDef.formula.simple]
      }
      const isCollected = previousAchievementIds.has(achievementDef._id.toString()) || achievementDef.targetValue <= value

      userAchievements.push({
        _id: achievementDef._id,
        name: achievementDef.name,
        description: achievementDef.description,
        sortOrder: achievementDef.sortOrder,
        targetValue: achievementDef.targetValue,
        value,
        isCollected
      })
    })

    return userAchievements
  }
}

const UserDetailsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  hasDisabledTutorial: Boolean,
  selectedCourse: String,
  progress: [ProgressSchema],
  collectedAchievements: [mongoose.Schema.Types.ObjectId],
  achievementStats: {
    watchedMovies: Number,
    answeredQuestions: Number,
  }
})

export const UserDetails = mongoose.model('userDetails', UserDetailsSchema)

export class UserDetailsRepository {
  async create (userId: string, courseId: string) {
    const newUserDetails = new UserDetails({userId})
    newUserDetails.progress.create({courseId, lesson: 1})

    await newUserDetails.save()

    return newUserDetails
  }

  async getById (userId: string) {
    return UserDetails.findOne({userId})
  }

  async getNextLessonPosition (courseId: string, userId: string) {
    const userDetails = await UserDetails.findOne({userId})
    const course = _.find(userDetails.progress, doc => doc.courseId === courseId)

    if (!course) {
      return 1
    }

    return course.lesson
  }

  async updateNextLessonPosition (courseId: string, userId: string) {
    await UserDetails.update({ userId, 'progress.courseId': courseId }, { $inc: { 'progress.$.lesson': 1 } })
  }

  async updateCollectedAchievements (userId: string, collectedAchievementIds) {
    await UserDetails.update({userId}, {$set: {'collectedAchievements': collectedAchievementIds}})
  }

    async disableTutorial (userId: string) {
    return UserDetails.findOneAndUpdate({ userId }, { hasDisabledTutorial: true }, { new: true })
  }

  async selectCourse (userId: string, courseId: string) {
    const user = await UserDetails.findOne({userId})
    user.selectedCourse = courseId
    const course = _.find(user.progress, doc => doc.courseId === courseId)
    if (!course) {
      user.progress.push({courseId, lesson: 1})
    }
    await UserDetails.update({userId}, user)
    return { success: true }
  }

  async closeCourse (userId: string) {
    const user = await UserDetails.findOne({userId})
    user.selectedCourse = null
    await user.save()
    return { success: true }
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
  async createGuest (courseId: string) {
    const newUser = await Users.create({username: 'guest', password: 'notSet', activated: false, createdAt: moment().unix()})
    const newUserId = newUser._id.toString()
    await new UserDetailsRepository().create(newUserId, courseId)

    return newUser
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
