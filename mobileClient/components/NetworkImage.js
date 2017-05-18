import React from 'react';
import {
  Image,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

// https://github.com/facebook/react-native/issues/9581
// image caching is broken in react-native 0.30 - 0.44
// tried to use https://github.com/wcandillon/react-native-img-cache witout success
// clicking the image (enlarging and scaling down images causes http refetch every time)

export default class NetworkImage extends Image {
  constructor(props: Object) {
    super(props)
    this.state = {
      error: false,
      loading: false,
      progress: 0
    }
    this.imageViewStyle = {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
    }
    this.imageTextStyle = {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
      padding: 10,
      textAlign: 'center',
    }
  }

  render = () => {
    const loader = this.state.loading ?
      <View style={this.imageViewStyle}>
        <Text style={this.imageTextStyle}>{this.state.progress}%</Text>
        <ActivityIndicator size={'large'}/>
      </View> : null;

    const error = (
      <View style={this.imageViewStyle}>
        <Text style={this.imageTextStyle}>IMAGE COULDN`T BE LOADED</Text>
      </View>
    )

    //this.state.error should be logged on server side (e.g. catch bad urls)
    return this.state.error ? error :
      (
        <Image {...this.props}
               onLoadStart={(e) => this.setState({loading: true})}
               onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
               onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
               onLoad={() => this.setState({loading: false, error: false})}
        >
          {loader}
        </Image>
      )
  }
}
