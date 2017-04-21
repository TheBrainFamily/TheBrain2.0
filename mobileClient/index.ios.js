// @flow

import React, {Component} from 'react';
import {ApolloClient, ApolloProvider, createNetworkInterface} from 'react-apollo';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {NativeRouter, Route, Link} from 'react-router-native'

// import Home from './components/Home';
import WellDone from './components/WellDone';
import Lecture from './components/Lecture';
import Questions from './components/Questions';
import styles from './styles/styles';
// import Footer from './components/Footer';
// import Login from './components/Login';
// import Signup from './components/Signup';
import store, { client } from './store';

export default class App extends Component {
    render() {
        return (
            <ApolloProvider client={client} store={store}>
                <NativeRouter>
                    <View style={styles.mainPage}>
                        <View style={styles.topContainer}/>
                        <View>
                            <Route exact path="/" component={Lecture}/>
                            <Route exact path="/wellDone" component={WellDone}/>
                            <Route exact path="/questions" component={Questions}/>

                        </View>
                    </View>
                </NativeRouter>
            </ApolloProvider>
        )
    }
};

{/*<Route exact key="lecture" path="/lecture" component={Lecture}/>*/
}

AppRegistry.registerComponent('mobileClient', () => App);
