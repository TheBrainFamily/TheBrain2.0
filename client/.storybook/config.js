import { configure } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'

setOptions({
  name: 'JEST ADDON',
  url: 'https://github.com/renaudtertrais/storybook-addon-jest',
  downPanelInRight: true,
  showLeftPanel: true
})

function loadStories () {
  require('../src/stories')
}

configure(loadStories, module)
