if (process.env.COVERAGE) {
  console.log('Hook loader for coverage - ensure this is not production!')
  const im = require('babel-istanbul-middleware')
  im.hookLoader(__dirname) // cover all files except under node_modules
}

require('startup.js')
