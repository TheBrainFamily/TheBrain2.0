// @flow
import _ from 'lodash'
import moment from 'moment'

import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'

class ItemsRepository extends MongoRepository {
  itemsCollection: Collection

  init () {
    this.itemsCollection = this.db.collection('items')
  }

  async getItems (lessonPosition: number) {

  }

  async update (id: string, item: Object, userId: string) {
    return this.itemsCollection.update({_id: new ObjectId(id), userId: new ObjectId(userId)}, {$set: item})
  }

  async getItemById (_id: string, userId: string) {
    return this.itemsCollection.findOne({_id: new ObjectId(_id), userId: new ObjectId(userId)})
  }

  async create (flashcardId: string, userId: string) {
    const newItem = {
      flashcardId,
      userId: new ObjectId(userId),
      actualTimesRepeated: 0,
      easinessFactor: 2.5,
      extraRepeatToday: false,
      lastRepetition: 0,
      nextRepetition: 0,
      previousDaysChange: 0,
      timesRepeated: 0
    }
    await this.itemsCollection.insertOne(newItem)
    return newItem
  }

  async getReviews (userId: string) {
    const currentDayTimestamp = moment().startOf('day').unix()
    const items = await this.itemsCollection.find(
      {
        userId,
        nextRepetition: { $gte: currentDayTimestamp }
      },
      {
        nextRepetition: 1
      }).toArray()
    const itemsByDay = _.countBy(items, (item) => {
      const date = item.nextRepetition - item.nextRepetition % (24 * 60 * 60)
      return date
    })

    return _.map(itemsByDay, (count, ts) => ({
      ts: parseInt(ts), count
    }))
  }
}

export const itemsRepository = new ItemsRepository()
