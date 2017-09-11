// @flow
import { MongoRepository } from './MongoRepository'
import { Collection, ObjectId } from 'mongodb'

class FlashcardsRepository extends MongoRepository {
  flashcardsCollection: Collection

  init () {
    this.flashcardsCollection = this.db.collection('flashcards')
  }

  async getFlashcards () {
    const flashcards = await (this.flashcardsCollection.find()).toArray()
    return flashcards
  }

  async getFlashcardsByIds (ids: [Object]) {
    const objIds = ids.map(function (item){ return ObjectId(item)});
    const flashcardsQuery = {_id: { $in: objIds}}
    const flashcards = await this.flashcardsCollection.find(flashcardsQuery)
    return flashcards.toArray()
  }

  async getFlashcard (_id: string) {
    return this.flashcardsCollection.findOne({_id})
  }

  // This API is currently not used by the app,
  // but it's required for setting up tests
  async insertFlashcard () {

  }
}

export const flashcardRepository = new FlashcardsRepository()
