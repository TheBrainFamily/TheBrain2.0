// @flow

export const updateMainMenuVisibility = (shouldBeVisible: boolean) => {
  return {
    type: 'UPDATE_MENU_VISIBILITY',
    visible: shouldBeVisible
  }
}

export const updateMainMenuLoadingState = (loading: boolean) => {
  return {
    type: 'UPDATE_MENU_LOADING_STATE',
    loading
  }
}
