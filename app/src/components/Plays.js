import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

// import spinner from '../img/spinner.png';

class Plays extends React.Component{

  // constructor(){
  //   super();
  // }


  render(){
    return(
      <div>
        <ul className="CurrentPlay">
          <li className="subtitle">Current Play</li>
          <div className="noCurrentPlay">
            <p>No play has been selected.<br/>Choose a play from the list below to display it on the board.</p>
          </div>
          <li className="currentPlay name"><span>Name:  </span>{this.props.currentPlay.name}</li>
          <li className="currentPlay desc"><span>Description:  </span>{this.props.currentPlay.desc}</li>
        </ul>
        <CSSTransitionGroup className="plays" component="ul" transitionName="playsTransition" transitionEnterTimeout={10} transitionLeaveTimeout={800} >
          <li className="subtitle">Saved Plays</li>
          {
            this.props.plays &&
              Object
            .keys(this.props.plays)
            .map(key => <li key={key} onClick={() => this.props.drawPlay(key)}>{this.props.plays[key].name}</li>)
          }
        </CSSTransitionGroup>
        <button onClick={this.props.loadPlays} className="loadPlays">Load Sample Plays</button>
        <button onClick={this.props.deleteAllPlays} className="deleteAllPlays erase">Delete Plays</button>
      </div>
    )
  }
}

export default Plays;
