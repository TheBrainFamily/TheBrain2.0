// @flow
import _ from 'lodash'
import moment from 'moment'

import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import getItemsWithFlashcardsByCount from '../tools/getItemsWithFlashcardsByCount'

export class ItemsRepository extends MongoRepository {
  itemsCollection: Collection

  init () {
    this.itemsCollection = this.db.collection('items')
  }

  getItems (userDetails) {
    let currentItemsQuery = {
      userId: userDetails.userId,
      courseId: userDetails.selectedCourse,
      $or: [
        { actualTimesRepeated: 0 },
        { extraRepeatToday: true },
        { nextRepetition: { $lte: moment().unix() } }
      ]
    }
    if (userDetails.isCasual) {
      currentItemsQuery = _.extend({}, currentItemsQuery, {isCasual: true})
    }
    // currently changed to fetching two items, after testing and approving, code below should be refactored

    return this.itemsCollection.find(currentItemsQuery, {limit: 2, sort: {lastRepetition: 1}}).toArray()
  }

  async update (_id: string, item: Object, userId: string) {
    return this.itemsCollection.update({_id, userId}, {$set: item})
  }

  async getItemById (_id: string, userId: string) {
    return this.itemsCollection.findOne({_id, userId})
  }

  async create (flashcardId: string, userId: string, courseId: string, isCasual: Boolean) {
    const newItem = {
      _id: (new ObjectId()).toString(),
      flashcardId,
      userId,
      courseId,
      actualTimesRepeated: 0,
      easinessFactor: 2.5,
      extraRepeatToday: false,
      lastRepetition: 0,
      nextRepetition: 0,
      previousDaysChange: 0,
      timesRepeated: 0,
      isCasual: !!isCasual
    }
    await this.itemsCollection.insert(newItem)
    return newItem
  }

  async getReviews (userId: string, isCasual: Boolean) {
    let itemsQuery = {
      userId
    }
    if (isCasual) {
      itemsQuery = _.extend({}, itemsQuery, {isCasual: true})
    }
    const items = await this.itemsCollection.find(
      itemsQuery,
      {
        nextRepetition: 1
      }).toArray()
    const itemsByDay = _.countBy(items, (item) =>
      item.nextRepetition - item.nextRepetition % (24 * 60 * 60)
    )

    return _.map(itemsByDay, (count, ts) => ({
      ts: parseInt(ts), count
    }))
  }

  clearNotCasualItems (userId: string) {
    // TODO this will not work with TingoDB
    return this.itemsCollection.removeMany({userId, isCasual: false})
  }

  async getSessionCount (userId: string, userDetails: Object) {
    let currentItemsQuery = {
      userId,
      courseId: userDetails.selectedCourse,
      $or: [
        { actualTimesRepeated: 0 },
        { lastRepetition: { $gte: moment().subtract(3, 'hours').unix() } },
        { nextRepetition: { $lte: moment().unix() } }
      ]
    }
    if (userDetails.isCasual) {
      currentItemsQuery = _.extend({}, currentItemsQuery, {isCasual: true})
    }
    const items = await this.itemsCollection.find(currentItemsQuery).toArray()

    return getItemsWithFlashcardsByCount(items)
  }
}

export const itemsRepository = new ItemsRepository()
