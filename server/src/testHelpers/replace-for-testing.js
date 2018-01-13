// We are automatically replacing the Base Repository Class to use Tingo instead of MongoDB
module.exports = function replaceImport (originalPath, sourcePath) {
  let prefix = ''
  if (process.env.BABEL_ENV !== 'serverTest') {
    prefix = '/server'
  }
  if (originalPath.indexOf('./MongoRepository') !== -1) {
    const newPath = originalPath.replace('./MongoRepository', `./TingoRepository`)
    return newPath
  }

  if (originalPath.indexOf('graphql-tools') !== -1 && sourcePath.indexOf('node_modules') === -1) {
    const newPath = originalPath.replace('graphql-tools', `apollo-test-utils-with-context`)
    return newPath
  }

  if (originalPath.indexOf('bcrypt') !== -1) {
    const newPath = originalPath.replace('bcrypt', `apollo-test-utils-with-context`)
    return newPath
  }

  if (originalPath.indexOf('mongodb') !== -1) {
    return originalPath.replace('mongodb', `${process.cwd()}${prefix}/src/testHelpers/mockedMongodb`)
  }
}
