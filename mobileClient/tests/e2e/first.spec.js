/* eslint-env jest node */
/* global jest element by device waitFor */
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

jest.setTimeout(20000)

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
    console.log('welcome screen shown')
    // waiting for the app the expo app to boot, after that we shouldn't have to use manual waitFors
    await waitFor(element(by.id('skip_intro_button'))).toBeVisible().withTimeout(10000)

    await element(by.id('skip_intro_button')).tap()
    await expect(element(by.id('skip_intro_button'))).toBeNotVisible()
  }, 20000)

  it('should show hello screen after tap', async () => {
    // await element(by.id('skip_intro_button')).tap();
    await expect(element(by.id('skip_intro_button'))).toBeNotVisible()
  }, 20000)
})
