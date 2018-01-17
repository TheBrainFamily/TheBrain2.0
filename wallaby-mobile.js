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
      'testing/common/**/*.js',
      'testing/mobile/**/*.snap',
      'testing/mobile/jest.config.js'
    ],
    tests: [
      'testing/mobile/App.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'},
    setup: function (wallaby) {
      process.env.NODE_PATH = '';
      const jestConfig = require('./testing/mobile/jest.config');
      delete jestConfig.rootDir
      jestConfig.moduleDirectories = [
        'node_modules', '<rootDir>/server/node_modules', '<rootDir>/mobileClient/node_modules'
      ];
      wallaby.testFramework.configure(jestConfig);
    }
  }
};
