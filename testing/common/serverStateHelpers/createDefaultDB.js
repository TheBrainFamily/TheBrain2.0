import {
  getCoursesRepoWithDefaults, getFlashcardsRepoWithDefaults,
  getLessonsRepoWithDefaults
} from './helpers/reposWithDefaults'
import { dbConnectionPromise, dbConnector } from '../../../server/src/api/repositories/MongoRepository'

let createDefaultDb = async() => {
  await dbConnector()
  await dbConnectionPromise
  await getCoursesRepoWithDefaults()
  await getLessonsRepoWithDefaults()
  await getFlashcardsRepoWithDefaults()
}

createDefaultDb().then(() => {
  console.log('done!')
  process.exit(0)
}).catch((e) => {
  console.log('Error', e)
  process.exit(1)
})
