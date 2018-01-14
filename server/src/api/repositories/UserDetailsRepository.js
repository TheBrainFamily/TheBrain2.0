// @flow
import _ from 'lodash'
import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import { calculateUserLevel, getExperienceForAction } from '../../configuration/experienceConfig'

export class UserDetailsRepository extends MongoRepository {
  userDetailsCollection: Collection

  init () {
    this.userDetailsCollection = this.db.collection('userdetails')
  }

  async create (userId: string, courseId: string) {
    const newUserDetailsItem = {
      _id: (new ObjectId()).toString(),
      userId,
      hasDisabledTutorial: false,
      selectedCourse: courseId,
      // TODO selected course was set to empty string originally -double check that we are not braking anything by adding it here
      // TODO when you create a guest account courseId is undefined, so we probably shouldn't be setting the progress here
      progress: [{courseId, lesson: 1}],
      collectedAchievements: [],
      achievementStats: {
        watchedMovies: 0,
        answeredQuestions: 0
      },
      experience: {
        value: 0,
        level: 0
      }
    }
    await this.userDetailsCollection.insert(newUserDetailsItem)
    return newUserDetailsItem
  }

  async getById (userId: string) {
    return this.userDetailsCollection.findOne({userId})
  }

  async getNextLessonPosition (courseId: string, userId: string) {
    const userDetails = await this.userDetailsCollection.findOne({userId})
    const course = _.find(userDetails.progress, doc => doc.courseId === courseId)

    if (!course) {
      return 1
    }

    return course.lesson
  }

  async updateUserXp (userId: string, action: string) {
    let xpGained = getExperienceForAction(action)
    await this.userDetailsCollection.update({userId}, {$inc: {'experience.value': xpGained}}, {
      upsert: true
    })
    const userDetails = await this.userDetailsCollection.findOne({userId})
    const prevLevel = calculateUserLevel(userDetails.experience.value - xpGained)
    const newLevel = calculateUserLevel(userDetails.experience.value)
    const levelUp = (prevLevel && prevLevel < newLevel) || userDetails.experience.showLevelUp
    await this.userDetailsCollection.update({userId}, {$set: {'experience.level': newLevel, 'experience.showLevelUp': levelUp}})
  }

  async resetLevelUpFlag (userId: string) {
    // TODO this requires a test, and a rewrite to work witn tingodb
    return (await this.userDetailsCollection.findOneAndUpdate({userId}, {$set: {'experience.showLevelUp': false}}, {
      upsert: true
    })).value
  }

  async switchUserIsCasual (userId: string) {
    const currentUserDetails = await this.userDetailsCollection.findOne({userId})
    const isCasualToSet = !currentUserDetails.isCasual
    await this.userDetailsCollection.update({userId}, {$set: {isCasual: isCasualToSet}})
    currentUserDetails.isCasual = isCasualToSet
    return currentUserDetails
  }

  async setUserIsCasual (userId: string, isCasual: boolean) {
    const currentUserDetails = await this.userDetailsCollection.findOne({userId})
    await this.userDetailsCollection.update({userId}, {$set: { isCasual }})
    currentUserDetails.isCasual = isCasual
    return currentUserDetails
  }

  async updateNextLessonPosition (courseId: string, userId: string) {
    const userDetails = await this.userDetailsCollection.findOne({userId})
    const newProgress = userDetails.progress.map(p => {
      if (p.courseId === courseId) {
        return {...p, lesson: p.lesson + 1}
      }
      return p
    })
    await this.userDetailsCollection.update({userId}, {$set: {progress: newProgress}})

    // TODO fix positional operators in tingodb -
    // https://github.com/sergeyksv/tingodb/issues/34

    // userId: new ObjectId(userId),
    //   'progress.courseId': courseId
    // }, {$inc: {'progress.$.lesson': 1}})
  }

  async updateCollectedAchievements (userId: string, collectedAchievementIds) {
    await this.userDetailsCollection.update({userId}, {$set: {'collectedAchievements': collectedAchievementIds}})
  }

  async disableTutorial (userId: string) {
    await this.userDetailsCollection.update({userId}, {$set: {hasDisabledTutorial: true}})
    return this.userDetailsCollection.findOne({userId})
  }

  async selectCourse (userId: string, courseId: string) {
    const userDetails = await this.userDetailsCollection.findOne({userId})
    userDetails.selectedCourse = courseId
    const course = _.find(userDetails.progress, doc => doc.courseId === courseId)
    if (!course) {
      userDetails.progress.push({courseId, lesson: 1})
    }

    await this.userDetailsCollection.update({userId}, userDetails)
    return userDetails
  }

  async closeCourse (userId: string) {
    const userDetails = await this.userDetailsCollection.findOne({userId})
    userDetails.selectedCourse = null
    await this.userDetailsCollection.save(userDetails)
    return userDetails
  }
}

export const userDetailsRepository = new UserDetailsRepository()
