process.env.BABEL_ENV = "test"
process.env.ENZYME = true
process.env.NODE_ENV = "TESTING"

module.exports = (wallaby) => {
  return {
    debug: true,
    testFramework: 'jest',
    files: [
      'mobileClient/**/*.js',
      '!mobileClient/node_modules/**',
      'server/src/**/*.js',
      '!server/src/**/*.spec.js',
      'testing/testHelpers/**/*.js',
      'testingMobile/**/*.snap'
    ],
    tests: [
      'testingMobile/App.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'},
    setup: function (wallaby) {
      process.env.NODE_PATH = '';
      const jestConfig = require('./package.json').jest;
      jestConfig.moduleDirectories = [
        'node_modules', '<rootDir>/server/node_modules', '<rootDir>/mobileClient/node_modules'
      ];
      wallaby.testFramework.configure(jestConfig);
    }
  }
};
