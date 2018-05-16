import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Config from '../../utils/config';
import '../../stylesheets/css/main.css';
import axios from 'axios';
import viewButtonIconAlice from '../../resources/images/viewLocIcon.png';
import viewButtonIconBob from '../../resources/images/viewLocIconBob.png';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import Modal from '../Modal/Modal.js';

class LoCCard extends Component {
  constructor(props) {
		super(props);
		this.state = {
      redirect: false,
      showModal: false,
      toggleChecked: false,
      toggleDisabled: false
		}

    this.handleOnClick = this.handleOnClick.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.config = new Config();
	}

  handleOnClick() {
    this.props.callback(this.props.letter, false);
    this.setState({redirect: true});
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  shipProduct(letterId, evidenceHash) {
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.restServer.httpURL+'/ShipProduct', {
      "$class": "org.acme.loc.ShipProduct",
      "loc": letter,
      "evidence": evidenceHash,
      "transactionId": "",
      "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .catch(error => {
      console.log(error);
    });
    this.setState({
      toggleDisabled: true
    });
  }

  receiveProduct(letterId) {
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.restServer.httpURL+'/ReceiveProduct', {
      "$class": "org.acme.loc.ReceiveProduct",
      "loc": letter,
      "transactionId": "",
      "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .catch(error => {
      console.log(error);
    });
    this.setState({
      toggleDisabled: true
    });
  }

  generateStatus(letter) {
    let status = '';
    if (letter.status === 'AWAITING_APPROVAL') {
      status = 'Awaiting Approval';
    } else if (letter.status === 'READY_FOR_PAYMENT'){
      status = 'Payment Made';
    }
    else {
      status = letter.status.toLowerCase();
      status = status.charAt(0).toUpperCase() + status.slice(1);
    }
    return status;
  }

  generateCardContents(letter, user) {
    let contents;
    let newMessage = "";
    if(!this.props.letter.approval.includes("bob")){
      newMessage = "NEW";
    }
    //generate new LoC cards
    if (user === 'bob') {
      contents = (
        <div className = "LoCCardBob">
          <div>
            <h3>{newMessage}</h3>
            <h3>{'Ref: ' + letter.letterId}</h3>
            Participants: <b>{'Alice, Bank of Dinero, Bob, Eastwood Banking'}</b><br/><br/>
            Product Type: <b>{letter.productDetails.productType}</b>
            <div>
              <img class="viewButtonBob" src={viewButtonIconBob} alt="View Letter of Credit" onClick={() => this.handleOnClick()}/>
            </div>
          </div>
        </div>
      );
    }
    else { // if the current user is not bob then it must be alice
      contents = (
        <div className = "LoCCard">
          <div>
            <h3>{'Ref: ' + letter.letterId}</h3>
            Participants: <b>{'Alice, Bank of Dinero, Bob, Eastwood Banking'}</b><br/><br/>
            Product Type: <b>{letter.productDetails.productType}</b><p></p>
            <button className="viewButton" onClick={() => this.handleOnClick()}>
              <div className = "viewButtonImage">
                <img src = {viewButtonIconAlice} alt = ""/>
              </div>
              <p>View Letter Of Credit</p>
            </button>
          </div>
        </div>
      );
    }
    let statusMessage = this.generateStatus(letter);
    let shippingText;
    //generate accepted LoC cards
    if (user === 'bob') {
      if (letter.status !== 'AWAITING_APPROVAL') {
        // generating a hash from the timestamp
        let idStyle;
        shippingText = "Ship Order";
        if (letter.status !== 'APPROVED'){
          idStyle = "LoCCardBobAccepted";
          this.state.toggleChecked = true;
          this.state.toggleDisabled = true;
          shippingText = "Order Shipped";
        }
        let hash = new Date().getTime().toString(24);
        contents = (
          <div className = "LoCCardBob" id= {idStyle}>
            <Modal show={this.state.showModal} modalType={'SHIP'} cancelCallback={this.hideModal} yesCallback={() => {this.shipProduct(letter.letterId, hash)}}/>
            <div>
              <h3>{'Ref: ' + letter.letterId}</h3>
              <p>{statusMessage}</p>
              <p>{'Product Type: ' + letter.productDetails.productType}</p>
              <div className = "shipButtonDiv">
                <Toggle className='bobToggle' defaultChecked={this.state.toggleChecked} onChange={this.showModal} disabled ={this.state.toggleDisabled} />
                <span className="shipText">{shippingText}</span>
              </div>
              <div>
                <img class="viewButtonBob" src={viewButtonIconBob} alt="View Letter of Credit" onClick={this.handleOnClick}/>
              </div>
            </div>
          </div>
        );
      }
    } else {
      if (letter.status !== 'AWAITING_APPROVAL' && letter.status !== 'APPROVED') {
        // generating a hash from the timestamp
        shippingText = "Receive Order";
        if (letter.status !== 'SHIPPED') {
          this.state.toggleChecked = true;
          this.state.toggleDisabled = true;
          shippingText = "Order Received";
        }
        contents = (
          <div className = "LoCCard">
            <div>
              <h3>{'Ref: ' + letter.letterId}</h3>
              <p>{statusMessage}</p>
              <p>{'Product Type: ' + letter.productDetails.productType}</p>
              <div className = "shipButtonDiv">
                <Toggle className='aliceToggle' defaultChecked={this.state.toggleChecked} onChange={() => {this.receiveProduct(letter.letterId)}} disabled ={this.state.toggleDisabled} />
                <span className="shipText">{shippingText}</span>
              </div>
              <button className="viewButton" onClick={() => this.handleOnClick()}>
                <div className = "viewButtonImage">
                  <img src = {viewButtonIconAlice} alt = ""/>
                </div>
                <p>View Letter Of Credit</p>
              </button>
            </div>
          </div>
        );
      }
    }
    return contents;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/" + this.props.user + "/loc/" + this.props.letter.letterId} />;
    }
    return (
        this.generateCardContents(this.props.letter, this.props.user)
    );
  }
}

export default LoCCard;
