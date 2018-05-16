import React, { Component } from 'react';
import '../../../stylesheets/css/main.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import UserDetails from '../../UserDetails/UserDetails.js';
import LoCCard from '../../LoCCard/LoCCard.js';
import LoCApplyCard from '../../LoCCard/LoCApplyCard.js';
import Config from '../../../utils/config';
import aliceUsernameIcon from '../../../resources/images/viewLocIcon.png';

class AlicePage extends Component {
  constructor(props) {
		super(props);
		this.state = {
			userDetails: {},
			letters: [],
			gettingLetters: false,
			switchUser: this.props.switchUser,
			callback: this.props.callback,
      redirect: false,
      redirectTo: ''
		}
		this.handleOnClick = this.handleOnClick.bind(this);
		this.config = new Config();
	}

  handleOnClick(user) {
    this.state.switchUser(user);
    this.setState({redirect: true, redirectTo: user});
  }

	componentDidMount() {
		// open a websocket
		this.connection = new WebSocket(this.config.restServer.webSocketURL);
		this.connection.onmessage = ((evt) => {
			this.getLetters();
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
		let cURL = this.config.restServer.httpURL+'/Customer/alice';
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
			// sort the LOCs by descending ID (will display the most recent first)
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
		return (
      <LoCCard user="alice" letter={this.state.letters[i]} callback={this.state.callback} pageType={"view"}/>
    );
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
			}

			return (
    		<div id="alicePageContainer" className="alicePageContainer">
    		  <div id="aliceHeaderDiv" className="flexDiv aliceHeaderDiv">
    		    <span className="aliceUsername">
              <img src = {aliceUsernameIcon} alt = "" className = "aliceUsernameIcon"/>
              {username}
            </span>
    		    <div id="aliceMenu" className="aliceMenuItems">
    		      <span> Change account details </span>
    		      <span> View Transaction History </span>
    		      <span> Make Transaction </span>
    		      <span className="currentBalance"> Current Balance: $15,276 </span>
    		    </div>
    		  </div>
    		  <div id="infoDiv" className="flexDiv infoDiv">
    		    <div id="aliceWelcomeDiv" className="aliceWelcomeDiv">
    		      <h1 className = "aliceWelcomeMessage"> Welcome back {this.state.userDetails.name} </h1>
    		      <UserDetails name={this.state.userDetails.name} companyName={this.state.userDetails.companyName} IBAN={'AR22 9876 5321 9090'} swiftCode={'BKDOAR22'}/>
						</div>
					</div>
    		  <div className="locDiv">
    		    <LoCApplyCard user="alice" callback={this.state.callback} />
						{cardsJSX}
    		  </div>
				</div>
			);
  	} else {
			return (
			<div id="aliceLoadingContainer" className="alicePageContainer">
				<span className="loadingSpan">Loading...</span>
			</div>
			);
		}
	}
}

export default AlicePage;
