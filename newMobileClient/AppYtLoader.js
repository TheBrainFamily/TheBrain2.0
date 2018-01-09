import React from 'react'
import { StyleSheet, Text, View, WebView, TouchableWithoutFeedback, Dimensions } from 'react-native'

const onMessage = function (event) {
  if (event.nativeEvent.data === "0") {
    this.props.onFinished()
  }
  if (event.nativeEvent.data === "2") {
    this.props.onPaused()
  }
}

// This is a hack to make react-native work with youtube api
// https://github.com/facebook/react-native/issues/10865

const patchPostMessageFunction = function () {
  var originalPostMessage = window.postMessage
  window.originalPostMessage = originalPostMessage
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }
  window.postMessage = patchedPostMessage
}

const injectScript = '(' + String(patchPostMessageFunction) + ')();'

export default class YoutubeLoader extends React.Component {

  render () {
    console.log("Gandecki this.props.videoId", this.props.videoId);
    const myOwn = `
                <!DOCTYPE html>
       <html>
  <body>
    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>

    <script>
 


      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: '${this.props.videoId}',
          autoplay: true,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      document.addEventListener("fullscreenchange", function( event ) {
       postMessage("full screen change")
       setTimeout(function() {
         postMessage("full screen change later on")
       })
    // The event object doesn't carry information about the fullscreen state of the browser,
    // but it is possible to retrieve it through the fullscreen API
    if ( document.fullscreen ) {
        
        // The target of the event is always the document,
        // but it is possible to retrieve the fullscreen element through the API
        document.fullscreenElement;
    }

});
      
      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
       postMessage("event" + document.webkitFullscreenEnabled + " " + document.mozFullScreenEnabled + " " + document.msFullscreenEnabled + " " + document.fullscreenEnabled + " "   + JSON.stringify(event.data))
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        postMessage(JSON.stringify(event.data))
        if (event.data == YT.PlayerState.PLAYING && !done) {
          // setTimeout(stopVideo, 6000);
          done = true;
        }
      }

    </script>
  </body>
</html>
        `

    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
          <View style={{display: 'none'}}>
            <WebView
              injectedJavaScript={injectScript}
              style={{display: 'none'}}
              javaScriptEnabled={true}
              source={{html: myOwn}}
              onMessage={onMessage.bind(this)}
              mediaPlaybackRequiresUserAction={false}
            />
          </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
