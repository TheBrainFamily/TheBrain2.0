// @flow
import { Collection } from 'mongodb'
import { MongoRepository } from './MongoRepository'

export class CoursesRepository extends MongoRepository {
  coursesCollection: Collection

  init () {
    this.coursesCollection = this.db.collection('courses')
  }

  async getCourses () {
    return this.coursesCollection.find().toArray()
  }

  async getCourse (_id: string) {
    return this.coursesCollection.findOne({_id})
  }
}

export const coursesRepository = new CoursesRepository()
