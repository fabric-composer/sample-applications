/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
