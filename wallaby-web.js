process.env.BABEL_ENV="test"
process.env.ENZYME=true
process.env.NODE_ENV="TESTING"

module.exports = (wallaby) => {
  const path = require('path');

  process.env.NODE_PATH +=
    path.delimiter + path.join(wallaby.localProjectDir, 'node_modules') +
    path.delimiter + path.join(wallaby.localProjectDir, 'server', 'node_modules') +
    path.delimiter + path.join(wallaby.localProjectDir, 'client', 'node_modules')

  console.log("Gandecki process.env.NODE_PATH", process.env.NODE_PATH);

  return {
    debug: true,
    testFramework: 'jest',
    files: [
      'client/src/**/*.js',
      'server/src/**/*.js',
      {pattern: '*/src/**/*.spec.js', ignore: true},
      {pattern: 'client/node_modules/jest/**/*.js', ignore: true},
      // {pattern: 'client/node_modules/**/*.js', ignore: true},
      {pattern: 'client/node_modules/jest-runtime/**/*.js', ignore: true},
      {pattern: 'client/node_modules/jest-cli/**/*.js', ignore: true},
      {pattern: 'client/node_modules/**/jest-cli/**/*.js', ignore: true},
      {pattern: 'client/node_modules/react-scripts/**/*.js', ignore: true},
      // {pattern: 'modules/*(browser|ui)*', ignore: true},
      // {pattern: 'modules/@(browser|ui)/**/*.js', ignore: true},
      // {pattern: 'testingMobile/testHelpers/*.js', instrument: true},
      {pattern: 'client/tests/**/*.js'},
      {pattern: 'testing/testHelpers/**/*.js'},
      {pattern: 'mobileClient/tests/testHelpers/**/*.js'},
      './clientEnzymeTest.json'
    ],
    tests: [
      // 'testing/resolvers.spec.js',
      // 'testing/test.spec.js',
      'cypress/integration/landingPage.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'},
    setup: function (wallaby) {
      var jestConfig = require('./clientEnzymeTest');
      jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig);
    }// --config ./clientEnzymeTest.json

  }
};