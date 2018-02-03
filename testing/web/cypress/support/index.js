/* eslint-env jest */
/* global cy */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
require('regenerator-runtime/runtime')
window.test = it

// Alternatively you can use CommonJS syntax:
// require('./commands')

// This is workaround for an issue in cypress causing tests to fail on CI
// due to improper sound card detection
cy.on('uncaught:exception', (err, runnable) => {
  expect(err.message).to.include('ALSA lib conf.c:4259:(_snd_config_evaluate) function snd_func_card_driver returned error: No such file or directory')
  return false
})
