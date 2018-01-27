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
      'testing/web/features/pageObjects/*.js',
      'testing/testHelpers/**/*.js',
      'testing/common/**/*.js',
      'testing/web/jest.config.js',
      {pattern: './.enzymePreviewStyle.css', instrument: false}
    ],
    tests: [
      'testing/web/features/*.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'},
    setup: function (wallaby) {
      const jestConfig = require('./testing/web/jest.config');
      delete jestConfig.rootDir
      jestConfig.moduleNameMapper['\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$'] = '<rootDir>/testing/fileMock.js'
      jestConfig.moduleDirectories = [
        'node_modules', '<rootDir>/server/node_modules', '<rootDir>/client/node_modules'
      ];
      wallaby.testFramework.configure(jestConfig);
    }// --config ./clientEnzymeTest.json
  }
};
