import React, { Component } from 'react';
import './style/css/App.css';
import Header from './components/header/header'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Pipeline from './components/content/pipeline/pipeline'
import BusinessPlan from "./components/content/pipeline/businessPlan";


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Pipeline}/>
                <Route path="/business_plan" component={BusinessPlan}/>
            </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
