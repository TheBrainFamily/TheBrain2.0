// @flow

export const open = (name: String) => {
  return {
    type: 'OPEN_COURSE',
    name
  }
}

export const close = () => {
  return {
    type: 'CLOSE_COURSE'
  }
}
