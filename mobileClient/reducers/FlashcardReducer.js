// @flow

const reducer = (state: Object = { x: 0, y: 0 }, action: Object) => {
  switch (action.type) {
    case 'UPDATE_ANSWER_VISIBILITY':
      return { ...state, visibleAnswer: action.visibleAnswer };
    case 'UPDATE_POSITION':
      return { ...state, x: action.x, y: action.y };
    default:
      return state;
  }
};

export default reducer;