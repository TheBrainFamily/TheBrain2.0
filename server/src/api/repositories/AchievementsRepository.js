// @flow
import { Collection } from 'mongodb'
import { MongoRepository } from './MongoRepository'

class AchievementsRepository extends MongoRepository {
  achievementsCollection: Collection

  init () {
    this.achievementsCollection = this.db.collection('achievementdefinitions')
  }

  async getUserAchievements (userDetails) {
    const achievementDefinitions = await this.achievementsCollection.find().toArray()
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

export const achievementsRepository = new AchievementsRepository()
