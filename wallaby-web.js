process.env.BABEL_ENV="test"
process.env.ENZYME=true
process.env.NODE_ENV="TESTING"
process.env.WALLABY=true

module.exports = (wallaby) => {
  return {
    debug: true,
    testFramework: 'jest',
    files: [
      'client/src/**/*.js',
      'client/tests/testHelpers/**/*.js',
      '!client/src/**/*.test.js',
      'server/src/**/*.js',
      '!server/src/**/*.spec.js',
      'cypress/integration/pageObjects/*.js',
      'cypress/integration/helpers/*.js',
      'testing/testHelpers/**/*.js',
      'cypress/jest.config.js',
      {pattern: './.enzymePreviewStyle.css', instrument: false}
    ],
    tests: [
      'cypress/integration/landingPage.test.js',
      'cypress/integration/lecture.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'},
    setup: function (wallaby) {
      const jestConfig = require('./cypress/jest.config');
      delete jestConfig.rootDir
      jestConfig.moduleDirectories = [
        'node_modules', '<rootDir>/server/node_modules', '<rootDir>/client/node_modules'
      ];
      wallaby.testFramework.configure(jestConfig);
    }// --config ./clientEnzymeTest.json
  }
};
