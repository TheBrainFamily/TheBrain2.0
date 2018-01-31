module.exports = function replaceImport (originalPath, sourcePath) {
  let enzymePrefix = ''
  if (process.env.ENZYME) {
    enzymePrefix = '/mobile'
  }
  if (originalPath.indexOf('graphql-tools') !== -1 && sourcePath.indexOf('node_modules') === -1) {
    const newPath = originalPath.replace('graphql-tools', `apollo-test-utils-with-context`)
    return newPath
  }
  if (originalPath.indexOf('./networkInterface') !== -1) {
    const newPath = originalPath.replace('./networkInterface', `${process.cwd()}${enzymePrefix}/tests/testHelpers/mockedNetworkInterface`)
    return newPath
  }
}
