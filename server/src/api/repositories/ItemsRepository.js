// @flow
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
}

export const itemsRepository = new ItemsRepository()
