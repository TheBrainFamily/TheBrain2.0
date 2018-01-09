// @flow

import gql from 'graphql-tag'

export default gql`
    query UserDetails {
        UserDetails {
            selectedCourse
            hasDisabledTutorial
            isCasual
            experience {
              level
              showLevelUp
            }
        }
    }
`
