// @flow
import _ from 'lodash'
import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import { calculateUserLevel, getExperienceForAction } from '../../configuration/experienceConfig'

class UserDetailsRepository extends MongoRepository {
  userDetailsCollection: Collection

  init () {
    this.userDetailsCollection = this.db.collection('userdetails')
  }

  create = async(userId: string, courseId: string) => {
    const newUserDetailsItem = {
      userId: new ObjectId(userId),
      hasDisabledTutorial: false,
      selectedCourse: "",
      progress: [{courseId, lesson: 1}],
      collectedAchievements: [],
      achievementStats: {
        watchedMovies: 0,
        answeredQuestions: 0,
      },
      experience: {
        value: 0,
        level: 0
      }
    }
    await this.userDetailsCollection.insertOne(newUserDetailsItem)
    return newUserDetailsItem
  }

  async getById (userId: string) {
    return this.userDetailsCollection.findOne({userId: new ObjectId(userId)})
  }

  async getNextLessonPosition (courseId: string, userId: string) {
    const userDetails = await this.userDetailsCollection.findOne({userId: new ObjectId(userId)})
    const course = _.find(userDetails.progress, doc => doc.courseId === courseId)

    if (!course) {
      return 1
    }

    return course.lesson
  }

  async updateUserXp (userId: string, action: string) {
    let xpGained = getExperienceForAction(action)
    const userDetails = (await this.userDetailsCollection.findOneAndUpdate({userId: new ObjectId(userId)}, {$inc: {'experience.value': xpGained}}, {
      upsert: true,
      returnNewDocument: true
    })).value

    const newLevel = calculateUserLevel(userDetails.experience.value)
    await this.userDetailsCollection.update({userId: new ObjectId(userId)}, {$set: {'experience.level': newLevel}})
  }

  async updateNextLessonPosition (courseId: string, userId: string) {
    await this.userDetailsCollection.update({ userId: new ObjectId(userId), 'progress.courseId': courseId }, { $inc: { 'progress.$.lesson': 1 } })
  }

  async updateCollectedAchievements (userId: string, collectedAchievementIds) {
    await this.userDetailsCollection.update({userId: new ObjectId(userId)}, {$set: {'collectedAchievements': collectedAchievementIds}})
  }

  async disableTutorial (userId: string) {
    return this.userDetailsCollection.findOneAndUpdate({ userId: new ObjectId(userId) }, { hasDisabledTutorial: true }, { new: true })
  }

  async selectCourse (userId: string, courseId: string) {
    const user = await this.userDetailsCollection.findOne({userId: new ObjectId(userId)})
    user.selectedCourse = courseId
    const course = _.find(user.progress, doc => doc.courseId === courseId)
    if (!course) {
      user.progress.push({courseId, lesson: 1})
    }

    console.log("JMOZGAWA: PRE");
    const obj =await this.userDetailsCollection.update({userId: new ObjectId(userId)}, user)
    console.log("JMOZGAWA: POST");
    console.log("JMOZGAWA: obj",obj);
    return { success: true }
  }

  async closeCourse (userId: string) {
    const user = await this.userDetailsCollection.findOne({userId: new ObjectId(userId)})
    user.selectedCourse = null
    await user.save()
    return { success: true }
  }
}

export const userDetailsRepository = new UserDetailsRepository()
