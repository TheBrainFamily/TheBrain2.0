/* eslint-env jest */
import { CoursesRepository } from '../../server/src/api/repositories/CoursesRepository'
import startApp from '../../testing/testHelpers/startApp'

let coursesRepository = new CoursesRepository()
coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})
// TODO make a default extendable context with user logged in / user not logged in
const context = {
  Courses: coursesRepository,
  user: {}
}

if (global.cy) {
  window.test = it
}

describe('Lecture', async () => {
  // In order to learn faster about a subject
  // As a student
  // I want to watch a lecture
  test('New student is watching the first lecture', async () => {
    // Given I am a new student
    // When I open the lecture page
    const driver = await startApp('/lecture', context)
    const lecturePage = new LecturePage(driver)

    // Then I see the first lecture form the series

  })


})

class LecturePage {
  constructor (driver) {
    // this.root = '';
    this.driver = driver
  }

  get skipTutorialButton () {
    return this.driver.getElement('.skip-tutorial-button')
  }

  async skipTutorial () {
    await this.skipTutorialButton.click()
  }
}
