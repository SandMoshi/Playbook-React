import React, { Component } from 'react';
import '../css/App.css';
import Board from "./Board";
import Plays from "./Plays";
import samplePlays from '../sample-plays';


class App extends React.Component {
  constructor() {
    super()
    this.loadPlays = this.loadPlays.bind(this);

    this.state = {
      plays: {}
    };
  }

  loadPlays(){
    this.setState({
      plays: samplePlays
    });
  }

  render(){
    return(
      <div className="main">
        <h1 className="pagetitle">Online Rubgy Playbook</h1>
        <Board />
        <div className="play-container">
          <Plays loadPlays={this.loadPlays} plays={this.state.plays}/>
        </div>
      </div>
    )
  };
}

export default App
