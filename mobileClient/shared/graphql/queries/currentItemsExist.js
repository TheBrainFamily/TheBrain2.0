// @flow

import gql from 'graphql-tag'

export default gql`
    query CurrentItemsExist {
        ItemsWithFlashcard {
            item {
                _id
            }
        }
    }
`
