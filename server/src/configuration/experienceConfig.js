const experienceGained = {
  processEvaluation: 2
}

export function getExperienceForAction (action) {
  let exp = 0
  if (experienceGained[action]) {
    exp = experienceGained[action]
  } else {
    throw Error(`could not find experience value for action: ${action}`)
  }
  return exp
}

export function calculateUserLevel (xp: Number) {
  return Math.floor(0.13 * Math.sqrt(xp * 2)) + 1
}
