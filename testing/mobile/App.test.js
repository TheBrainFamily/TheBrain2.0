/* eslint-env jest */
import { startAppMobileEnzyme } from './startAppMobileEnzyme'
import { LandingView } from '../../mobile/tests/e2e/viewObjects/LandingView'
import { CourseSelector } from '../../mobile/tests/e2e/viewObjects/CourseSelector'
import {
  getCoursesRepoWithDefaults,
  getFlashcardsRepoWithDefaults,
  getLessonsRepoWithDefaults
} from '../common/serverStateHelpers/helpers/reposWithDefaults'
import { LectureView } from '../../mobile/tests/e2e/viewObjects/LectureView'
import { QuestionsView } from '../../mobile/tests/e2e/viewObjects/QuestionsView'

const returnContext = async function () {
  const coursesRepository = await getCoursesRepoWithDefaults()
  const lessonsRepository = await getLessonsRepoWithDefaults()
  const flashcardsRepository = await getFlashcardsRepoWithDefaults()

  const context = {
    Courses: coursesRepository,
    Lessons: lessonsRepository,
    Flashcards: flashcardsRepository,
    req: {
      logIn: (user) => {
        console.log('Gandecki user', user)
        context.user = user
      }
    }
  }
  return context
}

jest.setTimeout(30000)

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('test', async () => {
  let context
  let driver
  beforeEach(async () => {
    context = await returnContext()
    driver = await startAppMobileEnzyme(context)
  })
  afterEach(() => {
    driver.wrapper.unmount()
  })
  it('renders the whole app without crashing', async () => {
    const landingView = new LandingView(driver)
    await landingView.assertIsVisible()
    await landingView.skipTutorial()
    //
    const courseSelector = new CourseSelector(driver)
    await courseSelector.assertIsVisible()
    await courseSelector.chooseBiology()
    //
    const lectureView = new LectureView(driver)

    await lectureView.assertIsVisible()
    await lectureView.skipLecture()
    //
    const questionsView = new QuestionsView(driver)
    await questionsView.hardcoreWarning.showHardcoreQuestions()
    //
    await driver.refresh()
    await questionsView.flashcard.assertQuestionShown('What is the name of this course')
    await questionsView.flashcard.flipFlashcard()

    await timeout(500) // TODO ugly hack, but will have to do for now
    await questionsView.flashcard.assertFlashcardShown('Biology')
  })
})
