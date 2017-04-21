const initialState = {
  isAnswerVisible: false,
}

const flashcard = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_ANSWER':
      return {
        ...state,
        isAnswerVisible: action.value
      }

    default:
      return state
  }
}

export default flashcard
