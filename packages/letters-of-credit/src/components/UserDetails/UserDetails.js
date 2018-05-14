import React, { Component } from 'react';
import '../../stylesheets/css/main.css';

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      companyName: this.props.companyName,
      swiftCode: this.props.swiftCode,
      IBAN: this.props.IBAN,
    }
  }

  render() {
    return (
      <div className="UserDetails">
        <h2>Business Account Details</h2>
        <div>Name: <b>{this.state.name}</b></div>
        <div>Company Name: <b>{this.state.companyName}</b></div>
        <div>IBAN: <b>{this.state.IBAN}</b></div>
        <div>SWIFT code: <b>{this.state.swiftCode}</b></div>
      </div>
    );
  }
}

export default UserDetails;
