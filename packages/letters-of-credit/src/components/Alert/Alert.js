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
import React from 'react';
import '../../stylesheets/css/main.css';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: this.props.amount,
      show: this.props.show
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      show: false
    });
  }

  render() {
    let containerStyle = (this.state.show) ? "alertContainer" : "alertContainer invisible";
    return (
      <div className={containerStyle}>
        <div className="tick"/>
        <div className="alert">
          <p>Your balance has increased by <b>{"$" + this.state.amount}</b>.</p>
          <button onClick={this.handleClick} disabled={!this.state.show}>×</button>
        </div>
      </div>
    );
  }
}

export default Alert;
