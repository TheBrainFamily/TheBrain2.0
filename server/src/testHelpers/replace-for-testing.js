// We are automatically replacing the Base Repository Class to use Tingo instead of MongoDB
module.exports = function replaceImport (originalPath) {
  if (originalPath.indexOf('./MongoRepository') !== -1) {
    const newPath = originalPath.replace('./MongoRepository', `./TingoRepository`)
    return newPath
  }

  if (originalPath.indexOf('graphql-tools') !== -1) {
    const newPath = originalPath.replace('graphql-tools', `apollo-test-utils-with-context`)
    return newPath
  }

  if (originalPath.indexOf('bcrypt') !== -1) {
    const newPath = originalPath.replace('bcrypt', `apollo-test-utils-with-context`)
    return newPath
  }
  // TODO it would be great (probably much faster) if we could not load the whole mongodb dependencies when testing - but there is a problem with new new ObjectId() all around our repositories, and tingodb doesn't provide that for us.
  // if (originalPath.indexOf('mongodb') !== -1) {
  //   return 'tingodb';
  // }
}
