// @flow

const reducer = (state: Object = { x: 0, y: 0 }, action: Object) => {
  switch (action.type) {
    case 'UPDATE_ANSWER_VISIBILITY':
      return { ...state, visibleAnswer: action.visibleAnswer }
    default:
      return state
  }
}

export default reducer
