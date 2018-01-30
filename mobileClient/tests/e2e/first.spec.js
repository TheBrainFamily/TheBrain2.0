/* eslint-env jest node */
/* global jest element by device waitFor */
import { LandingView } from './viewObjects/LandingView'
import { CourseSelector } from './viewObjects/CourseSelector'
import { DetoxDriver } from './helpers/DetoxDriver'
import { LectureView } from './viewObjects/LectureView'
import { QuestionsView } from './viewObjects/QuestionsView'

require('babel-polyfill')
const { reloadApp } = require('detox-expo-helpers')
const detox = require('detox')
const config = require('../../package.json').detox

beforeAll(async () => {
})

afterAll(async () => {
  await detox.cleanup()
})

// const timeout = ms => new Promise(res => setTimeout(res, ms))

jest.setTimeout(40000)

const getADriver = async () => {
  await waitFor(element(by.id('skip_intro_button'))).toBeVisible().withTimeout(10000)
  return new DetoxDriver()
}

export class SwipeBall {
  constructor (driver) {
    this.driver = driver
  }

  async answerCorrect () {
    await waitFor(element(by.id('swipe-ball'))).toBeVisible().withTimeout(10000)
    await expect(element(by.id('swipe-ball'))).toBeVisible()
    return element(by.id('swipe-ball')).tap()
    // return element(by.id('swipe-ball')).scrollTo('right')
  }

  async answerWrong () {
    await waitFor(element(by.id('swipe-ball'))).toBeVisible().withTimeout(10000)
    await expect(element(by.id('swipe-ball'))).toBeVisible()
    return element(by.id('swipe-ball')).tap()
    // return element(by.id('swipe-ball')).scrollTo('left')
  }
}
describe('Example', async () => {
  beforeAll(async () => {
    await detox.init(config)
    if (process.env.DETOX_EXTERNAL_LINK) {
      console.log('starting detox external link')
      const expUrl = process.env.DETOX_EXTERNAL_LINK
      console.log('Gandecki expUrl', expUrl)
      await device.launchApp({
        newInstance: true,
        url: expUrl,
        launchArgs: {EXKernelDisableNuxDefaultsKey: true}
      })
    } else {
      await reloadApp()
    }
    console.log('finished reloading')
  })

  it('should have welcome screen', async () => {
    const driver = await getADriver()
    const landingView = new LandingView(driver)
    await landingView.assertIsVisible()
    await landingView.skipTutorial()

    const courseSelector = new CourseSelector(driver)
    await courseSelector.assertIsVisible()
    await courseSelector.chooseBiology()

    const lectureView = new LectureView(driver)

    await lectureView.assertIsVisible()

    await lectureView.skipLecture()

    const questionsView = new QuestionsView(driver)
    console.log('before the assertion')
    await questionsView.flashcard.assertQuestionShown('What is the name of this course?')
    console.log('after assert')
    await questionsView.hardcoreWarning.showHardcoreQuestions()
    console.log('after show hardcore')
    await questionsView.flashcard.flipFlashcard()
    await questionsView.flashcard.assertAnswerShown('Biology')
    await questionsView.votingInstruction.dismissTutorial()

    // TODO for some reason swiping doesnt work, it says that it cant find the UI element, even though when I switch the swipe command to tap it works just fine and I can't see it tapping..
    // as a workaround we will have to make the voting possible through clicking at the 4 gates. This will also be nicer UX - as some of our testers were trying to do that instead of swipping the ball anyway
    // const swipeBall = new SwipeBall(driver)
    // await swipeBall.answerWrong()
    // await questionsView.flashcard.flipFlashcard()
    // await swipeBall.answerCorrect()
    // await questionsView.flashcard.flipFlashcard()
  }, 40000)

  it('should show hello screen after tap', async () => {
    // await element(by.id('skip_intro_button')).tap();
    // await expect(element(by.id('skip_intro_button'))).toBeNotVisible()
  }, 40000)
})
