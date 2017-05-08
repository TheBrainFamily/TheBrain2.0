import { push } from 'react-router-redux'

export default function redirectUnauthorizedUsers(props) {
  if (props.currentItems.loading || props.currentUser.loading) {
    return
  }

  const itemsWithFlashcard = props.currentItems.ItemsWithFlashcard

  if (itemsWithFlashcard.length > 0) {
    return
  }

  if (props.currentUser.activated) {
    props.dispatch(push('/'))
  } else {
    props.dispatch(push('/signup'))
  }
}
