module.exports = function replaceImport (originalPath) {
  if (originalPath.indexOf('graphql-tools') !== -1) {
    const newPath = originalPath.replace('graphql-tools', `apollo-test-utils-with-context`)
    return newPath
  }
  if (originalPath.indexOf('./networkInterface') !== -1) {
    const newPath = originalPath.replace('./networkInterface', `${process.cwd()}/tests/testHelpers/mockedNetworkInterface`)
    return newPath
  }
}
