/**
 * - check symlink in depencency and devDepency
 * - if found, generate rn-cli-config.js
 * - react-native start with rn-cli-config
 */

const packageJson = require('./package.json')
const fs = require('fs')
const exec = require('child_process').execSync
const appJson = require('./app.json')
const RN_CLI_CONFIG_NAME = `rn-cli-config-with-links.js`

main()

function main () {
  const deps = Object.keys(
    Object.assign({}, packageJson.dependencies, packageJson.devDependencies)
  )
  const symlinkPathes = getSymlinkPathes(deps)
  generateRnCliConfig(symlinkPathes, RN_CLI_CONFIG_NAME)
  generateExpoConfig(RN_CLI_CONFIG_NAME)
  runBundlerWithConfig(RN_CLI_CONFIG_NAME)
}

function getSymlinkPathes (deps) {
  const depLinks = []
  const depPathes = []
  deps.forEach(dep => {
    const stat = fs.lstatSync('node_modules/' + dep)
    if (stat.isSymbolicLink()) {
      depLinks.push(dep)
      depPathes.push(fs.realpathSync('node_modules/' + dep))
    }
  })

  console.log('Starting react native with symlink modules:')
  console.log(
    depLinks.map((link, i) => '   ' + link + ' -> ' + depPathes[i]).join('\n')
  )

  return depPathes
}

function generateRnCliConfig (symlinkPathes, configName) {
  const fileBody = `
var path = require('path');
var blacklist;
try {
  blacklist = require('metro-bundler/src/blacklist');
} catch(e) {
  blacklist = require('metro/src/blacklist');
}

var config = {
  extraNodeModules: {
    'react-native': path.resolve(__dirname, 'node_modules/react-native')
  },
  getBlacklistRE() {
    return blacklist([
      ${symlinkPathes.map(
    path =>
      `/${path.replace(
        /\//g,
        '[/\\\\]'
      )}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`
  )}
    ]);
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),

      // Include your forked package as a new root.
      ${symlinkPathes.map(path => `path.resolve('${path}')`)}
    ];
  }
};
module.exports = config;
  `

  fs.writeFileSync(configName, fileBody)
}

function generateExpoConfig (configName) {
  const packagerOpts = {
    projectRoots: '',
    assetExts: ['ttf'],
    config: configName
  }
  appJson.expo.packagerOpts = packagerOpts
  // simply rewrite the expo.packagerOpts, keep the rest identical
  const fileBody = JSON.stringify(appJson)
  fs.writeFileSync('app.json', fileBody)
}

function runBundlerWithConfig (configName) {
  exec(
    `npm run runExpo`,
    { stdio: [0, 1, 2] }
  )
}
