// @flow

const initialState = {
  visible: false
}

const reducer = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case 'UPDATE_MENU_VISIBILITY':
      return {...state, ...action.visible}
    case 'UPDATE_MENU_LOADING_STATE':
      return {...state, ...action}
    default:
      return state
  }
}

export default reducer
