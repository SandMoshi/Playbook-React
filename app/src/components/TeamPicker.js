import React from 'react';
import PropTypes from 'prop-types';

class TeamPicker extends React.Component{

  goToPlaybook(event){
    event.preventDefault();  //prevent page refresh on submit
    console.log(this.teamID.value);
    const teamID = this.teamID.value;
    this.context.router.history.push(`/team/${teamID}`);
  }

  render(){
    return(
          <form className="TeamPicker" onSubmit={(e) => this.goToPlaybook(e)} >
            <div className="header">
              <h1>Online Rugby Playbook</h1>
              <h2>View Existing or Create New Playbook</h2>
              <h3>Free, Secure, Fast</h3>
            </div>

            <h4>Please Choose a Name for your playbook...</h4>
            <div className="Choose">
              <input className="playbookName" type="text" required placeholder="Enter a Playbook Name" ref={(input) => {this.teamID = input}} />
              <br/>
              <button type="submit">View Playbook</button>
            </div>
          </form>
    )
  }
}

TeamPicker.contextTypes = {
  router: PropTypes.object.isRequired
}

export default TeamPicker;
