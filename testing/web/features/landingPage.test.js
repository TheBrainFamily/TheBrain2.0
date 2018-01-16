// Feature: Landing page
// In order to understand what TheBrain is about
// As a new student
// I want to see introduction info on the landing page and go to course selector

/* eslint-env jest */
import startApp from '../../testHelpers/startApp'
import { CourseSelectorPage } from './pageObjects/CourseSelectorPage'
import { LandingPage } from './pageObjects/LandingPage'
import { LecturePage } from './pageObjects/LecturePage'
import { getCoursesRepoWithDefaults, getLessonsRepoWithDefaults } from '../../common/serverStateHelpers/helpers/reposWithDefaults'

const returnContext = async function () {
  const coursesRepository = await getCoursesRepoWithDefaults()
  const lessonsRepository = await getLessonsRepoWithDefaults()
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
