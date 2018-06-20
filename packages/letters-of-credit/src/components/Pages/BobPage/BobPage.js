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
import Alert from '../../Alert/Alert.js'
import UserDetails from '../../UserDetails/UserDetails.js';
import LoCCard from '../../LoCCard/LoCCard.js';
import LoCApplyCard from '../../LoCCard/LoCApplyCard.js';
import Config from '../../../utils/config';

class BobPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {},
      letters: [],
      gettingLetters: false,
      callback: this.props.callback,
      alert: false,
      redirect: false,
      redirectTo: ''
    }
    this.config = new Config();
  }

	componentDidMount() {
    document.title = "Bob - Eastwood Banking";
    // open a websocket
    this.connection = new WebSocket(this.config.restServer.webSocketURL);
    this.connection.onmessage = ((evt) => {
      let eventInfo = JSON.parse(evt.data);
      eventInfo = eventInfo.$class.split('.').pop();
      this.getLetters();
      if(eventInfo === 'CloseEvent') {
        this.setState({
          alert: true
        });
      } else {
				if (this.state.alert) {
					this.setState({
						alert: false
					});
				}
      }
    });

    // make rest calls
    this.getUserInfo();
    this.getLetters();
  }

  componentWillUnmount() {
    this.connection.close();
  }

  getUserInfo() {
    let userDetails = {};
    let cURL = this.config.restServer.httpURL+'/Customer/bob';
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
  }

  getLetters() {
    this.setState({gettingLetters: true});
    axios.get(this.config.restServer.httpURL+'/LetterOfCredit')
    .then(response => {
      // sort the LOCs by descending ID
      response.data.sort((a,b) => b.letterId.localeCompare(a.letterId));
      // only want to display the first 5 LOCs
      let activeLetters = response.data.slice(0,5);
      this.setState ({
        letters: activeLetters,
        gettingLetters: false
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  generateCard(i) {
    // should only show LOCs that are ready for Bob to approve
    if (this.state.letters[i].approval.includes('resource:org.example.loc.BankEmployee#ella')){
      if(i < this.state.letters.length){
        return (
          <LoCCard letter={this.state.letters[i]} callback={this.state.callback} pageType={"view"} user="bob"/>
        );
      }
    } else {
      return <div />;
    }
  }

	getBalance() {
		let balance = 12000;
		this.state.letters.map(i => {
			balance += i.status === 'CLOSED' ? i.productDetails.quantity * i.productDetails.pricePerUnit * 1.15 : 0;
		});
		return balance.toLocaleString(undefined, {minimumFractionDigits: 2});
  }
  
  getBalanceIncrease() {
    let increase = 0;
    if (this.state.letters.length) {
      let closedLetter = this.state.letters[0];
      increase = (closedLetter.productDetails.quantity * closedLetter.productDetails.pricePerUnit * 1.15);
    }
    return increase;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/" + this.state.redirectTo} />;
    }

		if(this.state.userDetails.name && !this.state.gettingLetters) {
			let username = this.state.userDetails.name + ", Customer of " + this.state.userDetails.bank;

    	let cardsJSX = [];
    	if(this.state.letters.length) {
				for(let i = 0; i < this.state.letters.length; i++) {
					cardsJSX.push(this.generateCard(i));
				}
				cardsJSX.push(<div className="cardSpace">&nbsp;</div>);
			}

      return (
        <div id="bobPageContainer" className="bobPageContainer">
          <div id="bobHeaderDiv" className="flexDiv bobHeaderDiv">
            <span className="bobUsername"> {username} </span>
          </div>
          <div class="bobWelcomeDiv">
            <p id="welcomeMessage">Welcome back {this.state.userDetails.name}</p>
            <h1 id ="accountBalance">${this.getBalance().toLocaleString()}</h1>
            <Alert amount={this.getBalanceIncrease().toLocaleString(undefined, {minimumFractionDigits: 2})} show={this.state.alert}/>
          </div>
          <div id="infoDivBob" className="flexDiv infoDivBob">
            <div id="bobDetailsDiv" className="bobDetailsDiv">
              <UserDetails name={this.state.userDetails.name} companyName={this.state.userDetails.companyName} IBAN={'US22 1234 5678 0101'} swiftCode={'EWBKUS22'}/>
            </div>
          </div>
          <div className="locDivBob">
            <LoCApplyCard user="bob" callback={this.state.callback} />
            {cardsJSX}
          </div>
        </div>
      );
    } else {
      return (
        <div id="bobLoadingContainer" className="bobPageContainer">
          <span className="loadingSpan">Loading...</span>
        </div>
      );
    }
  }
}

export default BobPage;
