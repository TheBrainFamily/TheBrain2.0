process.env.BABEL_ENV="test"

module.exports = (wallaby) => {
  const path = require('path');
  // process.env.NODE_PATH = `${path.join(wallaby.localProjectDir, 'client/src')}`;
  console.log("Gandecki process.env.NODE_PATH", process.env.NODE_PATH);
  // process.env.NODE_PATH = path.join(wallaby.localProjectDir, 'server', 'node_modules');
  // process.env.NODE_PATH = path.join(wallaby.localProjectDir, 'node_modules');
  // process.env.NODE_PATH += path.delimiter + path.join(wallaby.localProjectDir, 'server', 'node_modules');
  process.env.NODE_PATH = path.join(wallaby.localProjectDir, 'client', 'node_modules');
  console.log("Gandecki process.env.NODE_PATH", process.env.NODE_PATH);

  return {
    debug: true,
    testFramework: 'jest',
    files: [
      'client/src/**/*.js',
      'server/src/**/*.js',
      {pattern: '*/src/**/*.spec.js', ignore: true},
      {pattern: '*/src/**/*.spec.js', ignore: true},
      {pattern: 'client/node_modules/jest/**/*.js', ignore: true},
      {pattern: 'client/node_modules/jest-runtime/**/*.js', ignore: true},
      // {pattern: 'modules/*(browser|ui)*', ignore: true},
      // {pattern: 'modules/@(browser|ui)/**/*.js', ignore: true},
      {pattern: 'testing/testHelpers/*.js', instrument: true}
    ],
    tests: [
      // 'testing/resolvers.spec.js',
      // 'testing/test.spec.js',
      'testing/integration.test.js',
    ],
    compilers: {'**/*.js': wallaby.compilers.babel()},
    env: {type: 'node', params: {
        env: "NODE_ENV=TESTING"
      }
    },
  }
};