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
import Config from '../../utils/config';
import '../../stylesheets/css/main.css';
import axios from 'axios';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import Modal from '../Modal/Modal.js';
import viewArrow from '../../resources/images/right-arrow.svg'

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
    let letter = "resource:org.example.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.restServer.httpURL+'/ShipProduct', {
      "$class": "org.example.loc.ShipProduct",
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
    let letter = "resource:org.example.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.restServer.httpURL+'/ReceiveProduct', {
      "$class": "org.example.loc.ReceiveProduct",
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
      status = letter.status.toUpperCase();
    }
    return status.toUpperCase();
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
            <h2>{newMessage}</h2>
            <h2>{'Ref: ' + letter.letterId}</h2>
            <p>Product Type: <b>{letter.productDetails.productType}</b></p>
            <div className = "toggleContainer hide">
              <Toggle className='customToggle' defaultChecked={false} disabled/>
              <span className="shipText">Ship Product</span>
            </div>
          </div>
          <img class="viewButtonBob" src={viewArrow} alt="View Letter of Credit" onClick={() => this.handleOnClick()}/>
        </div>
      );
    }
    else { // if the current user is not bob then it must be alice
      contents = (
        <div className = "LoCCard">
          <div>
            <h2>{this.generateStatus(letter)}</h2>
            <h2>{'Ref: ' + letter.letterId}</h2>
            <p>Product Type: <b>{letter.productDetails.productType}</b></p>
            <div className = "toggleContainer hide">
                <Toggle className='customToggle customToggleAlice' defaultChecked={false} icons={false} disabled/>
                <span className="shipText">Receive Product</span>
              </div>
            <button className="viewButton" onClick={() => this.handleOnClick()}>
              <p className="buttonText"><span>View Letter Of Credit</span></p>
            </button>
          </div>
        </div>
      );
    }
    let shippingText;
    let checked = letter.status !== 'APPROVED';
    //generate accepted LoC cards
    if (user === 'bob') {
      if (letter.status !== 'AWAITING_APPROVAL') {
        // generating a hash from the timestamp
        let idStyle;
        shippingText = "Ship Product";
        if (letter.status !== 'APPROVED'){
          idStyle = "LoCCardBobAccepted";
          this.state.toggleChecked = true;
          this.state.toggleDisabled = true;
          shippingText = "Product Shipped";
        }
        let hash = new Date().getTime().toString(24);
        contents = (
          <div className = "LoCCardBob" id= {idStyle}>
            <Modal show={this.state.showModal} modalType={'SHIP'} cancelCallback={this.hideModal} yesCallback={() => {this.shipProduct(letter.letterId, hash)}}/>
            <div>
              <h2>{this.generateStatus(letter)}</h2>
              <h2>{'Ref: ' + letter.letterId}</h2>
              <p>Product Type: <b>{letter.productDetails.productType}</b></p>
              <div className = "toggleContainer">
                <Toggle className='customToggle' checked={checked} defaultChecked={this.state.toggleChecked} onChange={this.showModal} disabled ={this.state.toggleDisabled} />
                <span className="shipText">{shippingText}</span>
              </div>
                <img class="viewButtonBob" src={viewArrow} alt="View Letter of Credit" onClick={this.handleOnClick}/>
            </div>
          </div>
        );
      }
    } else {
      if (letter.status !== 'AWAITING_APPROVAL' && letter.status !== 'APPROVED' && letter.status !== 'REJECTED') {
        // generating a hash from the timestamp
        shippingText = "Receive Product";
        if (letter.status !== 'SHIPPED') {
          this.state.toggleChecked = true;
          this.state.toggleDisabled = true;
          shippingText = "Product Received";
        }
        contents = (
          <div className = "LoCCard">
            <div>
              <h2>{this.generateStatus(letter)}</h2>
              <h2>{'Ref: ' + letter.letterId}</h2>
              <p>Product Type: <b>{letter.productDetails.productType}</b></p>
              <div className = "toggleContainer">
                <Toggle className='customToggle customToggleAlice' defaultChecked={this.state.toggleChecked} icons={false} onChange={() => {this.receiveProduct(letter.letterId)}} disabled ={this.state.toggleDisabled}/>
                <span className="shipText">{shippingText}</span>
              </div>
              <button className="viewButton" onClick={() => this.handleOnClick()}>
                <p className="buttonText"><span>View Letter Of Credit</span></p>
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
