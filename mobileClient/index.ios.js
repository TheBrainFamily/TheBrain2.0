/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {ApolloClient, ApolloProvider, createNetworkInterface} from 'react-apollo';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {NativeRouter, Route, Link} from 'react-router-native'

// import Home from './components/Home';
// import WellDone from './components/WellDone';
import Lecture from './components/Lecture';
// import Questions from './components/Questions';
// import Footer from './components/Footer';
// import Login from './components/Login';
// import Signup from './components/Signup';


// export default class MobileClient extends Component {
//     render() {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.welcome}>
//                     Welcome to React Native!
//                 </Text>
//                 <Text style={styles.instructions}>
//                     To get started, edit index.ios.js
//                 </Text>
//                 <Text style={styles.instructions}>
//                     Press Cmd+R to reload,{'\n'}
//                     Cmd+D or shake for dev menu
//                 </Text>
//             </View>
//         );
//     }
// }

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
    opts: {
        credentials: 'include',
    },
});

const client = new ApolloClient({
    networkInterface,
});

export default class App extends Component {
    render() {
        return (<NativeRouter>
          <ApolloProvider client={client}>
            <View>
              <Route exact key="home" path="/" component={Lecture}/>
              <Route exact key="lecture" path="/lecture" component={Lecture}/>

            </View>
          </ApolloProvider>
        </NativeRouter>)
    }
};


AppRegistry.registerComponent('mobileClient', () => App);
