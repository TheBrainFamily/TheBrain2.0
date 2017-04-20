export const updateAnswerVisibility = (value) => {
  return {
    type: 'UPDATE_ANSWER_VISIBILITY',
    visibleAnswer: value,
  };
};

export const updatePosition = (x, y) => {
  return {
    type: 'UPDATE_POSITION',
    x,
    y,
  };
};