import React from 'react';

class Plays extends React.Component{

  constructor(){
    super();
  }

  render(){
    return(
      <div>
        <ul className="CurrentPlay">
          <li className="subtitle">Current Play</li>
          <li className="currentPlay name"><span>Name:  </span>{this.props.currentPlay.name}</li>
          <li className="currentPlay desc"><span>Description:  </span>{this.props.currentPlay.desc}</li>
        </ul>
        <ul className="plays">
          <li className="subtitle">Saved Plays</li>
          {
            Object
            .keys(this.props.plays)
            .map(key => <li key={key} onClick={() => this.props.drawPlay(key)}>{this.props.plays[key].name}</li>)
          }

        </ul>
        <button onClick={this.props.loadPlays} className="loadPlays">Load Sample Plays</button>
        <button onClick={this.props.deleteAllPlays} className="deleteAllPlays erase">Delete Plays</button>
      </div>
    )
}
}

export default Plays;
