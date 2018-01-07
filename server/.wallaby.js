process.env.BABEL_ENV = 'serverTest'
process.env.NODE_ENV = 'testing'

module.exports = (wallaby) => {
  const path = require('path')
  process.env.NODE_PATH = `${path.join(wallaby.localProjectDir, 'src')}`
  return {
    debug: true,
    testFramework: 'jest',
    files: [
      'src/**/*.js',
      'package.json',
      {pattern: 'src/**/*.spec.js', ignore: true},
    ],
    tests: [
      'src/**/*.spec.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'}
  }
}