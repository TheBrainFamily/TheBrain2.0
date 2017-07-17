import { Platform } from 'react-native'

export const appStyle = {
  header: {
    offset: Platform.OS === 'ios' ? 20 : 0,
    height: 116
  },
  colors: {
    text: '#fff',
    textAlt: '#222',
    textLight: '#ccc',
    bg: '#9050ba',
    bgAlt: '#fff',
    bgDark: '#000'
  }
}

export default appStyle
