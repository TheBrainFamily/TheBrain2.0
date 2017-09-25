// @flow

const initialState = {
  visible: false
}

const reducer = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case 'SET_OVERLAY':
      return { ...state, ...action.value }
    default:
      return state
  }
}

export default reducer
