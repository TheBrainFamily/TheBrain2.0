import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tutorial from './components/Tutorial';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to TheBrain.Pro</h2>
        </div>
        <div className="App-intro">
            <Tutorial/>
        </div>
      </div>
    );
  }
}

export default App;
