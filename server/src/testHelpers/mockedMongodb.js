import { mongoObjectId } from './mongoObjectId'

module.exports = {
  ObjectId: function () {
    return {
      toString: mongoObjectId
    }
  }
}
