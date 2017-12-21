// We are automatically replacing the Base Repository Class to use Tingo instead of MongoDB
module.exports = function replaceImport (originalPath) {
  if (originalPath.indexOf('./MongoRepository') !== -1) {
    const newPath = originalPath.replace('./MongoRepository', `./TingoRepository`);
    return newPath;
  }

  // if (originalPath.indexOf('mongodb') !== -1) {
  //   console.log("found mongodb")
  //   const newPath = originalPath.replace('mongodb', `../src/testHelpers/mongo`);
  //   return newPath;
  // }

};
