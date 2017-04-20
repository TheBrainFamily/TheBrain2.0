const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ANSWER_VISIBILITY':
      return { ...state, visibleAnswer: action.visibleAnswer };
    default:
      return state;
  }
};

export default reducer;