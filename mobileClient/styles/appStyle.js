import { Platform } from 'react-native'

const appStyle = {
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
  },
  pageTitle: {
    height: 38
  },
  calendarHeader: {
    height: 28
  }
}

appStyle.header.totalHeight = appStyle.header.height + appStyle.header.offset

export default appStyle
