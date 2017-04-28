import update from 'immutability-helper'

const initialState = {
  isAnswerVisible: false,
}

const flashcard = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_ANSWER':
      return update(state, {
        isAnswerVisible: { $set: action.value }
      })

    default:
      return state
  }
}

export default flashcard
