import moment from 'moment'

export default function getItemsWithFlashcardsByCount (items) {
  const sessionCount = {
    newDone: 0,
    newTotal: 0,
    dueDone: 0,
    dueTotal: 0,
    reviewDone: 0,
    reviewTotal: 0
  }

  items.forEach((item) => {
    if (item.actualTimesRepeated === 0) {
      sessionCount.newTotal++
    }
    if (item.actualTimesRepeated === 1 && evaluatedInCurrentSession(item)) {
      sessionCount.newDone++
      sessionCount.newTotal++
    }
    if (item.extraRepeatToday && evaluatedInCurrentSession(item)) {
      sessionCount.reviewTotal++
    }

    if (item.actualTimesRepeated > 1) {
      if (evaluatedInCurrentSession(item)) {
        sessionCount.dueDone++
      }
    }

    if (dueCurrentSession(item)) {
      sessionCount.dueTotal++
    } else if (evaluatedInCurrentSession(item) && item.actualTimesRepeated > 1) {
      sessionCount.dueTotal++
      if (!item.extraRepeatToday && item.timesRepeated === 0) {
        sessionCount.reviewDone++
        sessionCount.reviewTotal++
      }
    }

    if (
      evaluatedInCurrentSession(item) &&
      item.actualTimesRepeated === 1 &&
      !item.extraRepeatToday &&
      evaluatedIncorrectlyInCurrentSession(item)
    ) {
      sessionCount.reviewDone++
      sessionCount.reviewTotal++
    }
  })

  return sessionCount
}

function evaluatedIncorrectlyInCurrentSession (item) {
  return item.timesRepeated === 0 && item.actualTimesRepeated !== item.timesRepeated
}

function evaluatedInCurrentSession (item) {
  return item.lastRepetition >= moment().subtract(3, 'hours').unix()
}

function dueCurrentSession (item) {
  return item.nextRepetition > 0 && item.nextRepetition <= moment().unix()
}
