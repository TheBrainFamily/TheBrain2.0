// Feature: Landing page
// In order to understand what TheBrain is about
// As a new student
// I want to see introduction info on the landing page and go to course selector

/* eslint-env jest */
import { CoursesRepository } from '../../server/src/api/repositories/CoursesRepository'
import startApp from '../../testing/testHelpers/startApp'
import { CourseSelectorPage } from './pageObjects/CourseSelectorPage'
import { LandingPage } from './pageObjects/LandingPage'
import { LessonsRepository } from '../../server/src/api/repositories/LessonsRepository'
import { LecturePage } from './pageObjects/LecturePage'

const returnContext = async function () {
  const coursesRepository = new CoursesRepository()
  await coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'testCourseName'})
  await coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'testCourseName2'})

  const lessonsRepository = new LessonsRepository()
  await lessonsRepository.lessonsCollection.insert(
    {
      _id: 'lessonId',
      position: 1,
      description: 'first lesson',
      flashcardIds: [],
      youtubeId: 'QnQe0xW_JY4',
      courseId: 'testCourseId'
    }
  )
  const context = {
    Courses: coursesRepository,
    Lessons: lessonsRepository,
    req: {
      logIn: (user) => {
        context.user = user
      }
    }
  }
  return context
}

describe('Landing Page', () => {
  // Scenario: New student is introduced to the page

  test('Watching introduction', async () => {
    // Given I am a new student
    // When I open a landing page
    const driver = await startApp('/', await returnContext())
    const mainPage = new LandingPage(driver)

    // Then I see the introduction info
    await mainPage.introductionVideo.assertIsVisible()
  }, 20000)

  test('Going to course selector and selecting course', async () => {
    // Given I am a new student
    // When I open a landing page
    const driver = await startApp('/', await returnContext())
    const mainPage = new LandingPage(driver)
    // And I finish the introduction video
    await mainPage.skipTutorial()

    // Then I should be able to select a course and see the first lecture
    const courseSelectorPage = new CourseSelectorPage(driver)
    await courseSelectorPage.assertIsVisible()

    await courseSelectorPage.selectFirstCourse()

    const lecturePage = new LecturePage(driver)

    await lecturePage.assertIsVisible()

  })
})
