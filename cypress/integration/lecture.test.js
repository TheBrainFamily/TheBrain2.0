/* eslint-env jest */
import startApp from '../../testing/testHelpers/startApp'
import { LecturePage } from './pageObjects/LecturePage'
import {
  getCoursesRepoWithDefaults, getFlashcardsRepoWithDefaults,
  getLessonsRepoWithDefaults
} from './helpers/reposWithDefaults'
import { UsersRepository } from '../../server/src/api/repositories/UsersRepository'
import { UserDetailsRepository } from '../../server/src/api/repositories/UserDetailsRepository'
import { FlashcardsRepository } from '../../server/src/api/repositories/FlashcardsRepository'
import { QuestionsPage } from './pageObjects/QuestionsPage'

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
  const flashcardsRepository = new FlashcardsRepository()

  flashcardsRepository.flashcardsCollection.insert({})
  return {
    Courses: await getCoursesRepoWithDefaults(),
    Lessons: await getLessonsRepoWithDefaults(),
    Flashcards: await getFlashcardsRepoWithDefaults(),
    Users: usersRepository,
    UserDetails: userDetailsRepository,
    user: loggedInUser
  }
}


describe('Lecture', async () => {
  // In order to learn faster about a subject
  // As a student
  // I want to watch a lecture
  test('New student is watching the first lecture and sees the generated flashcards', async () => {
    // Given I am a new student
    // When I open the lecture page
    const context = await returnContext()
    console.log("Gandecki context.Courses", context.Courses);
    const driver = await startApp('/lecture', context)
    const lecturePage = new LecturePage(driver)
    await lecturePage.skipLecture()

    const questionsPage = new QuestionsPage(driver)
    await questionsPage.assertFlashcardShown("What is the name of this course")
    // console.log(driver.wrapper.find(".flashcard-content-text").text().indexOf("What is"))
    // Then I see the first lecture form the series

  }, 10000)

})

// create the logged in user with courses