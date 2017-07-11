import React from 'react';

class Plays extends React.Component{
  render(){
    return(
      <div>
        <ul className="plays">
          {
            Object
            .keys(this.props.plays)
            .map(key => <li key={key}>{this.props.plays[key].name}</li>)
          }
        </ul>
        <button onClick={this.props.loadPlays} className="loadPlays">Load Sample Plays</button>
      </div>
            )
          }
}

export default Plays;
