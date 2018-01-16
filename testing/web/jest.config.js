module.exports = {
  'rootDir': '../../',
  'displayName': 'web enzyme e2e',
  'testMatch': ['<rootDir>/testing/web/features/landingPage.test.js', '<rootDir>/testing/web/features/lecture.test.js'],
  'moduleNameMapper': {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/testing/fileMock.js',
    '\\.(css|less)$': '<rootDir>/testing/fileMock.js'
  },
  'testURL': 'http://localhost',
  'testEnvironment': 'jsdom'
}
