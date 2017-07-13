import React from 'react';

import '../css/App.css';

class SavePlay extends React.Component{
  constructor(){
    super();

  }

  render(){
    return(
      <form className="save2list" onSubmit={ (event) => this.props.save2list(event, this.inputplayname.value)}>
        <input type="text" required placeholder="Play Name" ref={ (input) => {this.inputplayname = input}}/>
        <div>
          <button className="save2list">Save Play</button>
        </div>
      </form>
    )
  }
}

export default SavePlay;
