const {injectBabelPlugin} = require('react-app-rewired')
const packageJson = require('./package.json');
const fs = require('fs');


//BASED ON https://github.com/facebook/metro/issues/1#issuecomment-346502388 by @GingerBear :pray:

function getSymlinkPathes() {
  const deps = Object.keys(
    Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
  );
  const depLinks = [];
  const depPathes = [];
  deps.forEach(dep => {
    const stat = fs.lstatSync('node_modules/' + dep);
    if (stat.isSymbolicLink()) {
      depLinks.push(dep);
      depPathes.push(fs.realpathSync('node_modules/' + dep));
    }
  });

  console.log('Starting create-react-app with symlink modules:');
  console.log(
    depLinks.map((link, i) => '   ' + link + ' -> ' + depPathes[i]).join('\n')
  );

  return depPathes;
}

module.exports = function override (config, env) {

  const babel = config.module.rules
    .find(rule => 'oneOf' in rule)
    .oneOf.find(rule => /babel-loader/.test(rule.loader))

  if (!Array.isArray(babel.include)) {
    babel.include = [babel.include]
  }


  babel.include = babel.include.concat(getSymlinkPathes())


  if (process.env.CYPRESS) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['module-rewrite-with-root', {
      'replaceFunc': './src/tests/testHelpers/replace-for-testing.js',
      'optionalRoot': 'client/'
    }], config)
    // console.log("Gandecki config", config);
    console.log('Gandecki config', config.module.rules)
    console.log('Gandecki env', env)
  }
  return config
}
