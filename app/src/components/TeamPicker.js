import React from 'react';

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
          <h1>Online Rugby Playbooks</h1>
          <h2>Create or View a Playbook</h2>
          <h3>Please Choose a Name for the Playbook</h3>
          <input type="text" required placeholder="Playbook Name" ref={(input) => {this.teamID = input}} />
          <button type="submit">View Playbook</button>
        </form>
    )
  }
}

TeamPicker.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default TeamPicker;
