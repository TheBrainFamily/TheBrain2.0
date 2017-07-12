const experienceGained = {
  processEvaluation: 5,
}

export getExperienceForAction = (action) => {
  let exp = 0
  if(experienceGained[action]) {
    exp = experienceGained[action]
  } else {
    throw Error(`could not find experience value for action: ${action}`)
  }
  return exp
}

export calculateUserLevel = (xp: Number) => {
  return Math.floor(0.25 * Math.sqrt(xp)) + 1
}
