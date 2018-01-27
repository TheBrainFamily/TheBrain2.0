module.exports = {
  'rootDir': '../../',
  'displayName': 'web enzyme e2e',
  'testMatch': ['<rootDir>/testing/web/features/*.test.js'],
  'moduleNameMapper': {
    '\\.(css|less)$': '<rootDir>/testing/fileMock.js'
  },
  'transform': {
    '^.+\\.js$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/testing/testHelpers/fileTransformer.js'
  },
  'testURL': 'http://localhost',
  'testEnvironment': 'jsdom'
}
