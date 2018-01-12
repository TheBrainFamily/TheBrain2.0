// We are automatically replacing the Base Repository Class to use Tingo instead of MongoDB
module.exports = function replaceImport (originalPath, sourcePath) {
  if (originalPath.indexOf('graphql-tools') !== -1 && sourcePath.indexOf('node_modules') === -1) {
    const newPath = originalPath.replace('graphql-tools', `apollo-test-utils-with-context`);
    return newPath;
  }
  if (originalPath.indexOf('./startAppChromeless') !== -1) {
    const newPath = originalPath.replace('./startAppChromeless', `${process.cwd()}/tools/mockedNetworkInterface`);
    return newPath;
  }
  if (originalPath.indexOf('./startAppTestCafe') !== -1) {
    const newPath = originalPath.replace('./startAppTestCafe', `${process.cwd()}/tools/mockedNetworkInterface`);
    return newPath;
  }
  if (!process.env.ENZYME && originalPath.indexOf('./startAppEnzyme') !== -1) {
    const newPath = originalPath.replace('./startAppEnzyme', `${process.cwd()}/testing/fileMock`);
    return newPath;
  }

};
