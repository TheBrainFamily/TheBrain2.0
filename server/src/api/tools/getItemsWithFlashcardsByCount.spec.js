import _ from 'lodash'
import moment from 'moment'

import getItemsWithFlashcardsByCount from './getItemsWithFlashcardsByCount'

function makeItemWithFlashcard (params = {}) {
  return _.defaultsDeep({}, params, {
    item: {
      actualTimesRepeated: 0,
      easinessFactor: 2.5,
      extraRepeatToday: false,
      lastRepetition: 0,
      nextRepetition: 0,
      previousDaysChange: 0,
      timesRepeated: 0
    }
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
  it('should count 0 flashcards correctly by type', () => {
    const flashcards = []
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult())
  })

  it('should count newly created items with flashcards correctly by type', () => {
    const flashcards = [
      makeItemWithFlashcard(),
      makeItemWithFlashcard()
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newTotal: 2 }))
  })

  it('should count items with flashcards correctly by type when one item was evaluated as wrong', () => {
    const flashcards = [
      makeItemWithFlashcard(),
      makeItemWithFlashcard({ item: { extraRepeatToday: true, actualTimesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 1, newTotal: 2, reviewTotal: 1 }))
  })

  it('should count items with flashcards correctly by type when one item was evaluated as good', () => {
    const flashcards = [
      makeItemWithFlashcard(),
      makeItemWithFlashcard({ item: { timesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 1, newTotal: 2, reviewTotal: 0 }))
  })

  it('should count items with flashcards correctly by type when one item was evaluated as wrong and one as good', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { extraRepeatToday: true, actualTimesRepeated: 1 } }),
      makeItemWithFlashcard({ item: { timesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 2, newTotal: 2, reviewTotal: 1 }))
  })

  it('should count items with flashcards correctly by type when one reviewed item was evaluated as wrong', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { actualTimesRepeated: 1, extraRepeatToday: true } }),
      makeItemWithFlashcard({ item: { timesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 2, newTotal: 2, reviewTotal: 1 }))
  })

  it('should count items with flashcards correctly by type when one reviewed item was evaluated as good', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { actualTimesRepeated: 1, extraRepeatToday: true } }),
      makeItemWithFlashcard({ item: { actualTimesRepeated: 2, timesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 2, newTotal: 2, reviewDone: 1, reviewTotal: 1 }))
  })

  it('should count items with flashcards correctly by type when all new items were evaluated as wrong', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { extraRepeatToday: true, actualTimesRepeated: 1 } }),
      makeItemWithFlashcard({ item: { extraRepeatToday: true, actualTimesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 2, newTotal: 2, reviewTotal: 2 }))
  })

  it('should count items with flashcards correctly by type when all new items were evaluated as good', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { timesRepeated: 1 } }),
      makeItemWithFlashcard({ item: { timesRepeated: 1 } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ newDone: 2, newTotal: 2 }))
  })

  it('should count items with flashcards correctly by type when there are some due items', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { nextRepetition: moment().subtract(2, 'hours').unix() } }),
      makeItemWithFlashcard({ item: { nextRepetition: moment().unix() } })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ dueTotal: 2 }))
  })

  it('should count items with flashcards correctly by type when there are some due items and one was evaluated as wrong', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { nextRepetition: moment().subtract(2, 'hours').unix() } }),
      makeItemWithFlashcard({
        item: {
          nextRepetition: moment().add(5, 'hours').unix(),
          timesRepeated: 0,
          extraRepeatToday: true,
          actualTimesRepeated: 3
        }
      })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ dueDone: 1, dueTotal: 2, reviewTotal: 1 }))
  })

  it('should count items with flashcards correctly by type when there are some due items and one was evaluated as good', () => {
    const flashcards = [
      makeItemWithFlashcard({ item: { nextRepetition: moment().subtract(2, 'hours').unix() } }),
      makeItemWithFlashcard({
        item: {
          nextRepetition: moment().add(10, 'hours').unix(),
          actualTimesRepeated: 3
        }
      })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ dueDone: 1, dueTotal: 2 }))
  })

  it('should count items with flashcards correctly by type when there are some due items and one was evaluated as wrong and one as good', () => {
    const flashcards = [
      makeItemWithFlashcard({
        item: {
          nextRepetition: moment().add(5, 'hours').unix(),
          timesRepeated: 0,
          extraRepeatToday: true,
          actualTimesRepeated: 3
        }
      }),
      makeItemWithFlashcard({
        item: {
          nextRepetition: moment().add(10, 'hours').unix(),
          actualTimesRepeated: 3
        }
      })
    ]
    const itemsByCount = getItemsWithFlashcardsByCount(flashcards)

    expect(itemsByCount).toEqual(getResult({ dueDone: 2, dueTotal: 2, reviewTotal: 1 }))
  })
})
