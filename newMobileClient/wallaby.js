module.exports = (wallaby) => {
  return {
    debug: true,
    testFramework: 'jest',
    files: [
      '**/*.js',
      'package.json',
      {pattern: 'tests/**/*.js', ignore: true},
      {pattern: 'tests/*.js', ignore: true},
      {pattern: 'node_modules/**/*.js', ignore: true}
    ],
    tests: [
      'tests/*.test.js',
      'tests/**/*.js'
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node'}
  }
}
