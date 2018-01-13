process.env.BABEL_ENV="test"
process.env.ENZYME=true
process.env.NODE_ENV="TESTING"


module.exports = (wallaby) => {
  const path = require('path');

  process.env.NODE_PATH +=
    path.delimiter + path.join(wallaby.localProjectDir, 'node_modules') +
    path.delimiter + path.join(wallaby.localProjectDir, 'server', 'node_modules') +
    path.delimiter + path.join(wallaby.localProjectDir, 'mobileClient', 'node_modules')

  console.log("Gandecki process.env.NODE_PATH", process.env.NODE_PATH);

  return {
    debug: true,
    testFramework: 'jest',
    files: [
      'mobileClient/src/**/*.js',
      'server/src/**/*.js',
      {pattern: '*/src/**/*.spec.js', ignore: true},
      {pattern: 'mobileClient/node_modules/jest/**/*.js', ignore: true},
      {pattern: 'mobileClient/node_modules/**/*.js', ignore: true},
      {pattern: 'mobileClient/node_modules/jest-runtime/**/*.js', ignore: true},
      // {pattern: 'modules/*(browser|ui)*', ignore: true},
      // {pattern: 'modules/@(browser|ui)/**/*.js', ignore: true},
      {pattern: 'testingMobile/testHelpers/*.js', instrument: true},
      {pattern: 'mobileClient/tests/**/*.js'},
      {pattern: 'testing/testHelpers/**/*.js'}
    ],
    tests: [
      // 'testing/resolvers.spec.js',
      // 'testing/test.spec.js',
      'testingMobile/App.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'},
  }
};