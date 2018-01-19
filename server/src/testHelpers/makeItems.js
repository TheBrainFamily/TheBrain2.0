import _ from 'lodash'
import casual from 'casual'
import { mongoObjectId } from './mongoObjectId'

casual.define('item', function () {
  return {
    flashcardId: mongoObjectId(),
    userId: mongoObjectId(),
    actualTimesRepeated: 0,
    easinessFactor: 2.5,
    extraRepeatToday: false,
    lastRepetition: 0,
    nextRepetition: 0,
    previousDaysChange: 0,
    timesRepeated: 0
  }
})

type MakeItemsData = {
  number?: number,
  itemsToExtend?: Array<Object>
}

export function makeItems ({number: number = 2, itemsToExtend = [], itemsCollection}: MakeItemsData = {}) {
  const addedItems = []
  _.times(number, (index) => {
    let newFlashcard = casual.item
    if (itemsToExtend[index]) {
      newFlashcard = {
        ...newFlashcard,
        ...itemsToExtend[index]
      }
    }
    addedItems.push(newFlashcard)
  })
  return addedItems.map(item => itemsCollection.insert(item))
}
