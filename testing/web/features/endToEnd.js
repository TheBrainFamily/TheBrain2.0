/* eslint-env jest */
/* global cy */
import { CypressDriver } from '../../testHelpers/CypressDriver'
import { LandingPage } from './pageObjects/LandingPage'
import { CourseSelectorPage } from './pageObjects/CourseSelectorPage'
import { LecturePage } from './pageObjects/LecturePage'
import { QuestionsPage } from './pageObjects/QuestionsPage'

const getADriver = function () {
  cy.visit(`http://localhost:4000`, {
    onBeforeLoad: (win) => {
      win.sessionStorage.clear()
    }
  })

  return new CypressDriver()
}

describe('TheBrainApp', () => {
  it('allows the user to go through a journey', async () => {
    const driver = getADriver()
    const mainPage = new LandingPage(driver)
    await mainPage.introductionVideo.assertIsVisible()
    await mainPage.skipTutorial()

    const courseSelectorPage = new CourseSelectorPage(driver)
    await courseSelectorPage.assertIsVisible()

    await courseSelectorPage.selectFirstCourse()

    const lecturePage = new LecturePage(driver)

    await lecturePage.assertIsVisible()

    await lecturePage.skipLecture()

    const questionsPage = new QuestionsPage(driver)
    await questionsPage.assertFlashcardShown('What is the name of this course')
  })
})
