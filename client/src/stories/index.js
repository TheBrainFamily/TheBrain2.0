import { storiesOf } from '@storybook/react'

import './disableJestGlobals'
import withTests from './withTests'
import { ListWithThreeElements } from './List.test'
console.log("Gandecki withTests('List')", withTests('List'))

storiesOf('List', module)
  .addDecorator(withTests('List', 'List element with 3 items'))
  .add('3 items', () => (
    ListWithThreeElements
  ))
  .add('4 items', () => (
    ListWithThreeElements
  ))
