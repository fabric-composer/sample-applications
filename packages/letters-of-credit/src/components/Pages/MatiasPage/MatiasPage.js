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
import '../../../stylesheets/css/main.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Table from '../../Table/Table.js';
import Config from '../../../utils/config';
import matiasUsernameIcon from '../../../resources/images/viewLocIcon.png';

class MatiasPage extends Component {
  constructor(props) {
		super(props);
		this.state = {
			userDetails: {},
      letters: [],
      gettingLetters: false,
      switchUser: this.props.switchUser,
      callback: this.props.callback,
      redirect: false,
      redirectTo: '',
      isLetterOpen: false
		}
    this.handleOnClick = this.handleOnClick.bind(this);
    this.openLetter = this.openLetter.bind(this);
    this.config = new Config();
	}

  handleOnClick(user) {
    this.state.switchUser(user);
    this.setState({redirect: true, redirectTo: user});
  }

  openLetter(i) {
    this.props.callback(this.state.letters[i], false);
    this.setState({isLetterOpen: true, redirectTo: '/matias/loc/' + this.state.letters[i].letterId});
  }

	componentDidMount() {
    document.title = "Matías - Bank of Dinero";
    // open a websocket
    this.connection = new WebSocket(this.config.restServer.webSocketURL);
    this.connection.onmessage = ((evt) => {
      this.getLetters();
    });

    let userDetails = {};
		let cURL = this.config.restServer.httpURL+'/BankEmployee/matias';
		axios.get(cURL)
		.then(response => {
			userDetails = response.data;
		})
		.then(() => {
			let bankURL = this.config.restServer.httpURL+'/Bank/'+userDetails.bank.split('#')[1];
			return axios.get(bankURL)
		})
		.then(response => {
			userDetails.bank = response.data.name;
			this.setState ({
				userDetails: userDetails
			});
		})
		.catch(error => {
			console.log(error);
    });

    this.getLetters();
  }

  componentWillUnmount() {
    this.connection.close();
  }

  getLetters() {
		this.setState({gettingLetters: true});
		axios.get(this.config.restServer.httpURL+'/LetterOfCredit')
    .then(response => {
      // sort the LOCs by descending ID (will display the most recent first)
			response.data.sort((a,b) => b.letterId.localeCompare(a.letterId));
      this.setState ({
        letters: response.data,
        gettingLetters: false
			});
		})
		.catch(error => {
			console.log(error);
		});
	}

  generateStatus(letter) {
    let status = '';
    let statusColour;
    if (letter.status === 'AWAITING_APPROVAL') {
      if (!letter.approval.includes('resource:org.example.loc.BankEmployee#matias')) {
        status = 'Awaiting approval from YOU';
      } else if (!letter.approval.includes('resource:org.example.loc.BankEmployee#ella')) {
        status = 'Awaiting approval from Exporting Bank';
      } else if (letter.approval.includes('resource:org.example.loc.BankEmployee#ella') && !letter.approval.includes('resource:org.example.loc.Customer#bob')) {
        status = 'Awaiting approval from Beneficiary';
      }
      statusColour = "red";
    } else if (letter.status === 'READY_FOR_PAYMENT'){
      status = 'Payment Made';
      statusColour = "blue";
    }
    else {
      status = letter.status.toLowerCase();
      status = status.charAt(0).toUpperCase() + status.slice(1);

      if(letter.status === 'CLOSED') {
        statusColour = "green";
      }
      else {
        statusColour = "blue";
      }
    }
    return {status: status, statusColour: statusColour};
  }

  generateRow(i) {
    let submitter = "Alice Hamilton";
    let company = "QuickFix IT";
    if(this.state.letters[i].applicant === 'resource:org.example.loc.Customer#bob') {
      submitter = "Bob Appleton";
      company = "Conga Computers";
    }
    let status = this.generateStatus(this.state.letters[i]);
    let statusStyle = {
      backgroundColor: status.statusColour
    }
    return (
			<tr className="row" onClick={() => this.openLetter(i) }>
				<td className="blueText">{this.state.letters[i].letterId}</td>
				<td>{submitter}</td>
				<td>{company}</td>
        <td>
          {status.status}
        </td>
			</tr>
		);
  }

  render() {
    if(this.state.isLetterOpen) {
      return <Redirect push to={this.state.redirectTo} />;
    }
    else if (this.state.redirect) {
      return <Redirect push to={"/" + this.state.redirectTo} />;
    }

    if(this.state.userDetails.name && !this.state.gettingLetters) {
      let username = this.state.userDetails.name + ", Employee at " + this.state.userDetails.bank;

      let rowsJSX = [];
      if(this.state.letters.length) {
        for(let i = 0; i < this.state.letters.length; i++) {
          rowsJSX.push(this.generateRow(i))
        }
      }

      return (
        <div id="matiasPageContainer" className="matiasPageContainer">
          <div id="matiasHeaderDiv" className="flexDiv matiasHeaderDiv">
            <span className="matiasUsername">{username}</span>
            <span>Viewing All Business Acccounts</span>
          </div>
          <div id="matiasWelcomeDiv" className="matiasWelcomeDiv">
            <h1> Welcome back {this.state.userDetails.name} </h1>
          </div>
          <div id="tableDiv">
            <Table rows={rowsJSX} styling={"matiasTable"}/>
          </div>
        </div>
      );
    } else {
      return(
        <div id="matiasLoadingContainer" className="matiasPageContainer">
				  <span className="matiasLoadingSpan">Loading...</span>
        </div>
      );
    }
  }
}

export default MatiasPage;
