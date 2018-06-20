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

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionDetails: this.props.transactionDetails,
      date: this.props.date,
      time: this.props.time,
      number: this.props.number
    };
  }

  render() {
    return (
      <div className="Block">
        <div className="BlockLine"></div>
        <div className="BlockText">
          <p>{this.state.transactionDetails}</p>
          <p>{this.state.date}</p>
          <p>{this.state.time}</p>
        </div>
      </div>
    );
  }
}

export default Block;
