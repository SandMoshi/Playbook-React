import React from 'react';

class WrongUser extends React.Component{
  render(){
    const logout =
              <div className="logout">
                <button className="logout" onClick={() => this.props.logout()}>Log Out</button>
              </div>;
    return(
      <div className="signinwrapper">
        <div className="signinprompt">
          <h1>🚫</h1>
          <h2 className="error">Sorry {this.props.username}, you do not have permission to view this playbook.</h2>
          <h3>If you're looking to create your own playbook, please choose a new name for it.</h3>
          <h3>Or you may have to logout then log back in with an authorized account</h3>
          {logout} {/* //show the logout button */}
        </div>
      </div>
    )
  }
}

export default WrongUser;
