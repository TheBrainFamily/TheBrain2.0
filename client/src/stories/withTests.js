import withTests from 'storybook-addon-jest'
import jestTestResuls from './.jest-test-results.json'

console.log('Gandecki withTests', withTests)
export default withTests(jestTestResuls, {
  filesExt: '.test.js'
})
