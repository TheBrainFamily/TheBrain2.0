import moment from 'moment'

import { deepFreeze } from '../../testHelpers/testHelpers'
import returnItemAfterEvaluation from './returnItemAfterEvaluation'

const evaluationMap = {
  'No clue': 1,
  'Wrong': 2.5,
  'Good': 4.5,
  'Easy': 6
}

describe('returnItemAfterEvaluation', () => {
  it('returns a correct item after "No clue" evaluation', () => {
    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['No clue'], getNewItem())

    expect(itemAfterEvaluation.timesRepeated).toBe(0)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(true)
    expect(itemAfterEvaluation.previousDaysChange).toBe(1)
  })

  it('returns a correct item after "Wrong" evaluation', () => {
    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Wrong'], getNewItem())

    expect(itemAfterEvaluation.timesRepeated).toBe(0)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(true)
    expect(itemAfterEvaluation.previousDaysChange).toBe(1)
  })

  it('returns a correct item after "Good" evaluation', () => {
    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Good'], getNewItem())

    expect(itemAfterEvaluation.timesRepeated).toBe(1)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(false)
    expect(itemAfterEvaluation.previousDaysChange).toBe(1)
  })

  it('returns a correct item after "Easy" evaluation', () => {
    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Easy'], getNewItem())

    expect(itemAfterEvaluation.timesRepeated).toBe(1)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(false)
    expect(itemAfterEvaluation.previousDaysChange).toBe(1)
  })

  it('returns a correct item after "Wrong" evaluation of a reviewed flashcard', () => {
    const item = getNewItem()
    item.extraRepeatToday = true
    item.actualTimesRepeated = 1
    item.nextRepetition = moment().unix() + 100

    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Wrong'], deepFreeze(item))

    expect(itemAfterEvaluation.timesRepeated).toBe(0)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(true)
    expect(itemAfterEvaluation.previousDaysChange).toBe(0)
  })

  it('returns a correct item after "Easy" evaluation of a reviewed flashcard', () => {
    const item = getNewItem()
    item.extraRepeatToday = true
    item.actualTimesRepeated = 1
    item.nextRepetition = moment().unix() + 100

    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Easy'], deepFreeze(item))

    expect(itemAfterEvaluation.timesRepeated).toBe(0)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(false)
    expect(itemAfterEvaluation.previousDaysChange).toBe(0)
  })

  it('returns a correct item after "Good" evaluation of a due flashcard that was repeated once', () => {
    const item = getNewItem()
    item.timesRepeated = 1
    item.previousDaysChange = 1

    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Good'], deepFreeze(item))

    expect(itemAfterEvaluation.timesRepeated).toBe(2)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(false)
    expect(itemAfterEvaluation.previousDaysChange).toBe(5)
  })

  it('returns a correct item after "Good" evaluation of a due flashcard that was repeated more than once', () => {
    const item = getNewItem()
    item.timesRepeated = 3
    item.previousDaysChange = 5

    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Good'], deepFreeze(item))

    expect(itemAfterEvaluation.timesRepeated).toBe(4)
    expect(itemAfterEvaluation.extraRepeatToday).toBe(false)
    expect(itemAfterEvaluation.previousDaysChange).toBeGreaterThan(5)
  })

  it('returns a correct item with easiness factor after "Wrong" evaluation of a difficult flashcard', () => {
    const item = getNewItem()
    item.easinessFactor = 1.5

    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Wrong'], deepFreeze(item))

    expect(itemAfterEvaluation.easinessFactor).toBe(1.3)
  })

  it('returns a correct item with easiness factor after "Easy" evaluation of an easy flashcard', () => {
    const item = getNewItem()
    item.easinessFactor = 2.9

    const itemAfterEvaluation = returnItemAfterEvaluation(evaluationMap['Easy'], deepFreeze(item))

    expect(itemAfterEvaluation.easinessFactor).toBe(3)
  })
})

function getNewItem () {
  return {
    actualTimesRepeated: 0,
    easinessFactor: 2.5,
    extraRepeatToday: false,
    lastRepetition: 0,
    nextRepetition: 0,
    previousDaysChange: 0,
    timesRepeated: 0
  }
}
