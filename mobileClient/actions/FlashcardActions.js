export const updateAnswerVisibility = (value) => {
  return {
    type: 'UPDATE_ANSWER_VISIBILITY',
    visibleAnswer: value,
  };
};
