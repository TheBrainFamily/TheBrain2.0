const td = require('testdouble')

const globalFunctions = [
  'afterAll',
  'afterEach',
  'beforeAll',
  'beforeEach',
  'describe',
  'expect',
  'fit',
  'it',
  'pending',
  'pit',
  'test',
  'xdescribe',
  'xit',
  'xtest'
]

globalFunctions.forEach(jestFunction => {
  if (!window[jestFunction]) {
    window[jestFunction] = () => {}
  }
})

const globalObjects = ['jasmine',
  'jest']

globalObjects.forEach(jestObject => {
  if (!window[jestObject]) {
    window[jestObject] = td.object(jestObject)
  }
})
