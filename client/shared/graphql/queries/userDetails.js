// @flow

import gql from 'graphql-tag'

export default gql`
    query UserDetails {
        UserDetails {
            selectedCourse
            hasDisabledTutorial
            experience {
              level
              showLevelUp
            }
        }
    }
`