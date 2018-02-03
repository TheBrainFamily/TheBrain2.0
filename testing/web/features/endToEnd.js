/* eslint-env jest */
/* global cy */
import { CypressDriver } from '../../testHelpers/CypressDriver'
import { LandingPage } from './pageObjects/LandingPage'
import { CourseSelectorPage } from './pageObjects/CourseSelectorPage'
import { LecturePage } from './pageObjects/LecturePage'
import { QuestionsPage } from './pageObjects/QuestionsPage'
import { LoginPage } from './pageObjects/LoginPage'
import { HamburgerMenuPage } from './pageObjects/HamburgerMenuPage'
import { CalendarPage } from './pageObjects/CalendarPage'

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
    await questionsPage.showAnswer()
    await questionsPage.selectEasy()
    await questionsPage.assertFlashcardShown('How many letters are in the word \'Biology\'?')
    await questionsPage.showAnswer()
    await questionsPage.selectEasy()

    const loginPage = new LoginPage(driver)
    await loginPage.fillUsernameFieldWith(`John TheBrain(${new Date().getTime()})`)
    await loginPage.fillPasswordFieldWith('1234567890')
    await loginPage.login()

    await lecturePage.assertIsVisible()
    await lecturePage.skipLecture()

    await questionsPage.assertFlashcardShown('Why do we have two holes in our nose?')

    const hamburgerMenu = new HamburgerMenuPage(driver)
    await hamburgerMenu.toggleMenuButton()
    await hamburgerMenu.openCalendar()

    const calendarPage = new CalendarPage(driver)
    calendarPage.assertIsVisible()
    await calendarPage.assertRepetitionAreVisible(2)
  })
})
