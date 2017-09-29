// @flow

export const updateMainMenuVisibility = (shouldBeVisible: boolean) => {
  return {
    type: 'UPDATE_MENU_VISIBILITY',
    visible: shouldBeVisible
  }
}
