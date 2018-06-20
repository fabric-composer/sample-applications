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
import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/css/main.css';

class LoCApplyCard extends Component {
  constructor(props) {
		super(props);
		this.state = {
      redirect: false
		}
    this.handleOnClick = this.handleOnClick.bind(this);
	}

  handleOnClick() {
    this.props.callback({}, true);
    this.setState({redirect: true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.props.user + "/loc/create"} />;
    }
    return (
      <div className="LoCCard noBorder">
        <h2>{this.props.user === 'alice' ? 'Letter of Credit Application' : 'Letter of Credit Applications'}</h2>
        <p>A letter of credit is issued by a bank to another bank (especially one in a different country) to serve as a guarantee for payments made to a specified person under specified conditions.</p>
        {this.props.user === 'alice' && 
          <button className="viewButton applyButton" onClick={() => this.handleOnClick()}>Apply for a Letter of Credit</button>
        }
      </div>
    );
  }
}


export default LoCApplyCard;