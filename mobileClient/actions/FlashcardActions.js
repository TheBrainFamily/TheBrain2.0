// @flow

export const updateAnswerVisibility = (value: boolean) => {
  return {
    type: 'UPDATE_ANSWER_VISIBILITY',
    visibleAnswer: value,
  };
};

export const updatePosition = (x: number, y: number) => {
  return {
    type: 'UPDATE_POSITION',
    x,
    y,
  };
};