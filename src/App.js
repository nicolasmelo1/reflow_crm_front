import React, { Component } from 'react';
import './style/css/App.css';
import Header from './components/header/header'
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
      </div>
    );
  }
}

export default App;
