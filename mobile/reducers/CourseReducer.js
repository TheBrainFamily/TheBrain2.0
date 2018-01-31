// @flow

import update from 'immutability-helper'

const initialState = {
  selectedCourse: null
}

// TODO do we need to have this done through redux? Is graphQL with optimistic UI not enough?
const reducer = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case 'SELECT_COURSE':
      return update(state, {
        selectedCourse: { $set: action.value }
      })
    case 'CLOSE_COURSE':
      return update(state, {
        selectedCourse: { $set: null }
      })
    default:
      return state
  }
}

export default reducer
