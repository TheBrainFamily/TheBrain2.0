// @flow

export const updateAnswerVisibility = (shouldBeVisible: boolean) => {
  return {
    type: 'UPDATE_ANSWER_VISIBILITY',
    visibleAnswer: shouldBeVisible
  }
}
