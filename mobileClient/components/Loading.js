import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export default function ({ message = 'Loading...', lightStyle, backgroundColor, overlaying }) {
  const bgColor = backgroundColor ? { backgroundColor } : {}
  const overlayingLoader = overlaying ? styles.overlay : {}
  return (
    <View style={[styles.main, bgColor, overlayingLoader]}>
      <ActivityIndicator
        animating
        style={styles.centering}
        size='large'
      />
      <Text style={lightStyle ? styles.loadingLight : styles.loading}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loading: {
    textAlign: 'center',
    color: 'white',

    marginTop: 10
  },
  loadingLight: {
    textAlign: 'center',
    color: 'black',

    marginTop: 10
  },
  overlay: {
    position: 'absolute',
    zIndex: 999
  }
})
