import { Platform } from 'react-native'

export default {
  graphqlUri: Platform.OS === 'android' ? 'http://localhost:8080/graphql' : 'http://localhost:8080/graphql'
}
