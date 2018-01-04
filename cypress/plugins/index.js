const browserify = require('@cypress/browserify-preprocessor')


module.exports = (on) => {
  const options = browserify.defaultOptions
  options.browserifyOptions.transform[1][1].babelrc = true
  options.browserifyOptions.transform[1][1].plugins.push("get-rid-of-async-await")
  options.browserifyOptions.transform[1][1].presets.push("es2015")
  options.browserifyOptions.transform[1][1].presets.push("stage-2")
  console.log("preprocessing", options.browserifyOptions.transform)

  on('file:preprocessor', browserify(options))
}