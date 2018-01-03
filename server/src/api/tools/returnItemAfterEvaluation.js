// @flow

import _ from 'lodash'
import moment from 'moment'

const returnItemAfterEvaluation = function (evaluation: number, item: Object) {
  const currentDate = moment()
  const nextRepetitionDate = item.nextRepetition

  const evaluatedItem = _.cloneDeep(item)

  if (
    item.extraRepeatToday &&
    item.actualTimesRepeated > 0 &&
    currentDate.unix() <= nextRepetitionDate
  ) {
    if (evaluation >= 4) {
      evaluatedItem.extraRepeatToday = false
    }
  } else {
    const newParameters = processEvaluation(evaluation, item.easinessFactor, item.timesRepeated, item.previousDaysChange)

    // set the next repetition to the 6 am of the day of the repetition
    evaluatedItem.nextRepetition = moment(new Date()).add(newParameters.daysChange, 'days').startOf('day').add(6, 'hours').unix()
    evaluatedItem.easinessFactor = newParameters.easinessFactor

    if (newParameters.resetTimesRepeated) {
      evaluatedItem.extraRepeatToday = true
      evaluatedItem.timesRepeated = 0
    } else {
      if (evaluation === 3) {
        evaluatedItem.extraRepeatToday = true
      }
      evaluatedItem.timesRepeated++
    }

    evaluatedItem.actualTimesRepeated++
    evaluatedItem.previousDaysChange = newParameters.daysChange
  }

  evaluatedItem.lastRepetition = moment().unix()
  return evaluatedItem
}

export default returnItemAfterEvaluation

const processEvaluation = function (evaluation: number, easinessFactor: number, timesRepeated: number, previousDaysChange: number) {
  let resetTimesRepeated = false
  const newEasinessFactor = getEasinessFactor(evaluation, easinessFactor)

  let daysChange
  if (evaluation < 3) {
    daysChange = 1
    resetTimesRepeated = true
  } else if (timesRepeated === 0) {
    daysChange = 1
  } else if (timesRepeated === 1) {
    daysChange = 5
  } else {
    daysChange = Math.round(previousDaysChange * easinessFactor)
  }

  return { daysChange, easinessFactor: newEasinessFactor, resetTimesRepeated }
}

const getEasinessFactor = function (evaluation: number, easinessFactor: number): number {
  const newEasinessFactor = parseFloat((easinessFactor - 0.8 + (0.28 * evaluation) - (0.02 * evaluation * evaluation)).toFixed(2))

  if (newEasinessFactor <= 1.3) {
    return 1.3
  }
  if (newEasinessFactor >= 3.0) {
    return 3.0
  }

  return newEasinessFactor
}
