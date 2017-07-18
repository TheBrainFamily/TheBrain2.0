// @flow
import { Collection, ObjectId } from 'mongodb'
import moment from 'moment'
import { MongoRepository } from './MongoRepository'
import getItemsWithFlashcardsByCount from '../tools/getItemsWithFlashcardsByCount'

class ItemsWithFlashcardRepository extends MongoRepository {
  flashcardsCollection: Collection
  itemsCollection: Collection

  init () {
    this.flashcardsCollection = this.db.collection('flashcards')
    this.itemsCollection = this.db.collection('items')
  }

  async getItemsWithFlashcard (userId: string) {
    const currentItems = await (this.itemsCollection.find({
      userId: new ObjectId(userId),
      $or: [
        { actualTimesRepeated: 0 },
        { extraRepeatToday: true },
        { nextRepetition: { $lte: moment().unix() } }
      ]
    })).toArray()

    const flashcards = await (this.flashcardsCollection.find({_id: {$in: currentItems.map(item => item.flashcardId)}})).toArray()

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
    const items = await (this.itemsCollection.find({
      userId,
      $or: [
        { actualTimesRepeated: 0 },
        { lastRepetition: { $gte: moment().subtract(3, 'hours').unix() } },
        { nextRepetition: { $lte: moment().unix() } }
      ]
    })).toArray()

    return getItemsWithFlashcardsByCount(items)
  }
}

export const itemsWithFlashcardRepository = new ItemsWithFlashcardRepository()
