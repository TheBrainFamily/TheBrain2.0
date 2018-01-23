/* eslint-env jest */
import startApp from '../../testHelpers/startApp'
import { LecturePage } from './pageObjects/LecturePage'
import {
  getCoursesRepoWithDefaults, getFlashcardsRepoWithDefaults,
  getLessonsRepoWithDefaults
} from '../../common/serverStateHelpers/helpers/reposWithDefaults'
import { UsersRepository } from '../../../server/src/api/repositories/UsersRepository'
import { UserDetailsRepository } from '../../../server/src/api/repositories/UserDetailsRepository'
import { QuestionsPage } from './pageObjects/QuestionsPage'
import { HamburgerMenuPage } from './pageObjects/HamburgerMenuPage'
import { CalendarPage } from './pageObjects/CalendarPage'

const returnContext = async () => {
  const loggedInUser = {
    _id: '5a5cb174af92590d2571f849',
    username: 'guest',
    password: 'notSet',
    activated: true,
    createdAt: 1516024180
  }
  const usersRepository = new UsersRepository()
  await usersRepository.userCollection.insert(loggedInUser)
  const loggedInUserDetails = {
    '_id': '5a5cb1ba8cce748fdd7fbc33',
    'userId': '5a5cb174af92590d2571f849',
    'hasDisabledTutorial': true,
    'selectedCourse': 'testCourseId',
    'progress': [{'lesson': 1}, {'courseId': 'testCourseId', 'lesson': 1}],
    'collectedAchievements': [],
    'achievementStats': {'watchedMovies': 0, 'answeredQuestions': 0},
    'experience': {'value': 0, 'level': 0}
  }
  const userDetailsRepository = new UserDetailsRepository()
  await userDetailsRepository.userDetailsCollection.insert(loggedInUserDetails)

  return {
    Courses: await getCoursesRepoWithDefaults(),
    Lessons: await getLessonsRepoWithDefaults(),
    Flashcards: await getFlashcardsRepoWithDefaults(),
    Users: usersRepository,
    UserDetails: userDetailsRepository,
    user: loggedInUser
  }
}

describe('Calendar', async () => {
  test('User can see his repetitions scheduled in a calendar', async () => {
    const context = await returnContext()
    const driver = await startApp('/lecture', context)
    const lecturePage = new LecturePage(driver)
    await lecturePage.skipLecture()

    const questionsPage = new QuestionsPage(driver)
    await questionsPage.assertFlashcardShown('What is the name of this course')

    const hamburgerMenu = new HamburgerMenuPage(driver)
    await hamburgerMenu.toggleMenuButton()
    await hamburgerMenu.openCalendar()

    const calendarPage = new CalendarPage(driver)
    calendarPage.assertIsVisible()
    // TODO: need to figure out how to check the repetitions
  }, 10000)
})

// create the logged in user with courses
