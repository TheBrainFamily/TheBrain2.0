/* eslint-env jest node */
/* global jest element by */
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

jest.setTimeout(14000)
describe('Example', async () => {
  beforeAll(async () => {
    await detox.init(config)
    await reloadApp()
    console.log('finished reloading')
  })

  it('should have welcome screen', async () => {
    console.log('welcome screen shown')
    await element(by.id('skip_intro_button')).tap()
    await expect(element(by.id('skip_intro_button'))).toBeNotVisible()
  }, 15000)

  it('should show hello screen after tap', async () => {
    // await element(by.id('skip_intro_button')).tap();
    await expect(element(by.id('skip_intro_button'))).toBeNotVisible()
  }, 15000)
})
