const {injectBabelPlugin} = require('react-app-rewired')

module.exports = function override (config, env) {
  // do stuff with the webpack config...
  config = injectBabelPlugin(['module-rewrite-with-root', {
    'replaceFunc': './src/tests/testHelpers/replace-for-testing.js',
    'optionalRoot': 'client/'
  }], config)
  // console.log("Gandecki config", config);
  console.log('Gandecki config', config.module.rules)
  console.log('Gandecki env', env)
  return config
}
