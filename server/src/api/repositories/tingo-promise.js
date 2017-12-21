const Db = require('tingodb')({memStore: true, searchInArray: true}).Db
const thenify = require('thenify')

module.exports = function (collectionName = 'collectionName') {
  const db = new Db('', {})

  const collection = db.collection(collectionName)

  const newCollection = {}
  const methods = ['insert', 'findOne', 'count', 'update', 'remove']

  methods.forEach(method => {
    newCollection[method] = thenify(collection[method].bind(collection))
  })

  newCollection.find = (...args) => {
    const cursor = collection.find(...args)
    let methods = ['toArray', 'skip']
    const newCursor = {}
    methods.forEach(method => {
      newCursor[method] = thenify(cursor[method].bind(cursor))
    })
    newCursor.each = cursor.each.bind(cursor)
    newCursor.sort = (...args) => {
      const sortCursor = cursor.sort(...args)

      const newSort = {
        toArray: thenify(sortCursor.toArray.bind(sortCursor))
      }
      return newSort
    }
    return newCursor
  }

  return newCollection
}

