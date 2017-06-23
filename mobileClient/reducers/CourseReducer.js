// @flow

const courses = {
  Chemistry: {
    color: '#662d91'
  },
  Biology: {
    color: '#62c46c'
  }
}

const defaultState = { selectedCourse: null }

const reducer = (state: Object = defaultState, action: Object) => {
  switch (action.type) {
    case 'OPEN_COURSE':
      const selectedCourse = courses[action.name]
      return { ...state, selectedCourse }
    case 'CLOSE_COURSE':
      return { ...state, selectedCourse: null }
    default:
      return state
  }
}

export default reducer
