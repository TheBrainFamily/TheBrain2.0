// @flow

export const updateAnswerVisibility = (value: boolean) => {
  return {
    type: 'UPDATE_ANSWER_VISIBILITY',
    visibleAnswer: value,
  };
};
