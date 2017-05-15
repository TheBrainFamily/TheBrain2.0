import _ from 'lodash'
import moment from 'moment'

import getItemsWithFlashcardsByCount from './getItemsWithFlashcardsByCount'

function makeItem (params = {}) {
  return _.defaultsDeep({}, params, {
    actualTimesRepeated: 0,
    easinessFactor: 2.5,
    extraRepeatToday: false,
    lastRepetition: 0,
    nextRepetition: 0,
    previousDaysChange: 0,
    timesRepeated: 0
  })
}

function getResult (params = {}) {
  return _.defaults({}, params, {
    newDone: 0,
    newTotal: 0,
    dueDone: 0,
    dueTotal: 0,
    reviewDone: 0,
    reviewTotal: 0
  })
}

describe('getItemsWithFlashcardsByCount', () => {
  it('should count 0 flashcards by type', () => {
    const flashcards = []
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult())
  })

  it('should count newly created items', () => {
    const flashcards = [
      makeItem(),
      makeItem()
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({newTotal: 2}))
  })

  it('should categorize new item as a "to be reviewed" when it was evaluated as wrong', () => {
    const flashcards = [
      makeItem(),
      makeItem({extraRepeatToday: true, actualTimesRepeated: 1, lastRepetition: moment().subtract(2, 'hours').unix()})
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({newDone: 1, newTotal: 2, reviewTotal: 1}))
  })

  it('should categorize due item as a "to be reviewed" when it was evaluated as wrong', () => {
    const flashcards = [
      makeItem(),
      makeItem({extraRepeatToday: true, actualTimesRepeated: 2, lastRepetition: moment().subtract(2, 'hours').unix()})
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({newTotal: 1, reviewTotal: 1, dueTotal: 1, dueDone: 1}))
  })

  it('should categorize new item as "new done" when it was evaluated as good', () => {
    const flashcards = [
      makeItem(),
      makeItem({actualTimesRepeated: 1, timesRepeated: 1, lastRepetition: moment().subtract(2, 'hours').unix()})
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)
    expect(itemsByCount).toEqual(getResult({newDone: 1, newTotal: 2, reviewTotal: 0}))
  })

  it('should categorize due item as "new done" when it was evaluated as good', () => {
    const flashcards = [
      makeItem(),
      makeItem({actualTimesRepeated: 2, timesRepeated: 1, lastRepetition: moment().subtract(2, 'hours').unix()})
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)
    expect(itemsByCount).toEqual(getResult({newTotal: 1, reviewTotal: 0, dueDone: 1, dueTotal: 1}))
  })

  it('should categorize due item as "due total" when it was not evaluated yet', () => {
    const flashcards = [
      makeItem(),
      makeItem({actualTimesRepeated: 2, nextRepetition: moment().subtract(2, 'hours').unix()})
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)
    expect(itemsByCount).toEqual(getResult({newTotal: 1, reviewTotal: 0, dueDone: 0, dueTotal: 1}))
  })

  it('should categorize two new items when one item was evaluated as wrong and one as good', () => {
    const flashcards = [
      makeItem({extraRepeatToday: true, actualTimesRepeated: 1, lastRepetition: moment().subtract(2, 'hours').unix()}),
      makeItem({actualTimesRepeated: 1, timesRepeated: 1, lastRepetition: moment().subtract(2, 'hours').unix()})
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({newDone: 2, newTotal: 2, reviewTotal: 1}))
  })

  it('should categorize due item as reviewed when it was evaluated as good during review', () => {
    const flashcards = [
      makeItem({extraRepeatToday: false, timesRepeated: 0, actualTimesRepeated: 2, lastRepetition: moment().subtract(2, 'hours').unix()}),
      makeItem()
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({newTotal: 1, dueDone: 1, dueTotal: 1, reviewDone: 1, reviewTotal: 1}))
  })

  it('should categorize new item as reviewed when it was evaluated as good during review', () => {
    const flashcards = [
      makeItem({extraRepeatToday: false, timesRepeated: 0, actualTimesRepeated: 1, lastRepetition: moment().subtract(2, 'hours').unix()}),
      makeItem()
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({newTotal: 2, newDone: 1, reviewDone: 1, reviewTotal: 1}))
  })
})
