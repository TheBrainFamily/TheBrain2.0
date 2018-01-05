// @flow
import { Collection } from 'mongodb'
import { MongoRepository } from './MongoRepository'

export class LessonsRepository extends MongoRepository {
  lessonsCollection: Collection

  init () {
    this.lessonsCollection = this.db.collection('lessons')
  }

  async getLessons (courseId: string) {
    return this.lessonsCollection.find({courseId}).sort({position: 1}).toArray()
  }

  async getLessonCount () {
    return { count: await this.lessonsCollection.count() }
  }

  async getCourseLessonByPosition (courseId: string, position: number) {
    return this.lessonsCollection.findOne({ courseId, position })
  }

  async getLessonById (_id: string) {
    // console.log("_id ", _id);
    return this.lessonsCollection.findOne({_id})
  }
}

export const lessonsRepository = new LessonsRepository()
