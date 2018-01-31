// @flow

export const select = (value: String) => {
  return {
    type: 'SELECT_COURSE',
    value
  }
}

export const close = () => {
  return {
    type: 'CLOSE_COURSE'
  }
}
