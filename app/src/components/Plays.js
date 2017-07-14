import React from 'react';

class Plays extends React.Component{

  constructor(){
    super();
  }

  render(){
    return(
      <div>
        <ul className="plays">
          {
            Object
            .keys(this.props.plays)
            .map(key => <li key={key} onClick={() => this.props.drawPlay(key)}>{this.props.plays[key].name}</li>)
          }

        </ul>
        <button onClick={this.props.loadPlays} className="loadPlays">Load Sample Plays</button>
      </div>
              )
          }
        }
export default Plays;
