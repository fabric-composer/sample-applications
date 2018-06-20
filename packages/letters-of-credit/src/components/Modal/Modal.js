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

class Modal extends Component {
  constructor() {
    super();

    this.state = {
      isChecked: false,
      isLoading: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.cancelShipCallback = this.cancelShipCallback.bind(this);
    this.uploadInvoiceCallback = this.uploadInvoiceCallback.bind(this);
  }

  handleChange() {
    const previousState = this.state.isChecked;
    this.setState({
      isChecked: !previousState
    });
  }

  cancelShipCallback() {
    this.setState({
      isChecked: false
    });
    this.props.cancelCallback();
  }

  uploadInvoiceCallback() {
    this.setState({
      isLoading: true
    });
    this.props.yesCallback();
  }

  getMessage() {
    let message = "";
    if (this.props.modalType === 'CREATE' || this.props.modalType === 'APPROVE') {
      message = "By clicking 'Yes' you are agreeing to the Terms and Conditions of this Letter of Credit.";
      message += this.props.user !== 'bob' ? " The letter will now be sent to the next participant for approval." : ""
    } else if (this.props.modalType === 'REJECT') {
      message = "By clicking 'Yes' you are rejecting this application and the Letter of Credit will be closed. Once rejected, you will be unable to reopen this Letter of Credit.";
    } else if (this.props.modalType === 'PAY') {
      message = "By clicking 'Yes' you are agreeing that the applicant has received the goods in good condition, and you are willing to transfer the payment to the exporting bank.";
    } else {
      message = "By clicking 'Yes' you are agreeing that the Terms and Conditions of this Letter of Credit have been met, and that the payment has been made to the beneficiary.";
    }

    return message;
  }

  render() {
    if(this.props.show) {
      let message = this.getMessage();
      let containerClasses = "container " + (this.props.modalType === 'SHIP' ? "shipContainer" : "");
      let content;

      if(this.props.modalType === 'SHIP') {
        content = (
          <div>
            <h4 id="titleText" className="textMargins title">Upload an Invoice</h4>
            <table className="files-table">
              <tr>
                <td>
                  <label class="checkboxContainer">
                    <input type="checkbox" checked={this.state.isChecked} onChange={this.handleChange}/>
                    <span class="checkmark"></span>
                    shipping-invoice.pdf
                  </label>
                </td>
              </tr>
            </table>
            { this.state.isLoading && <p class="loadingMessage">Please wait... </p> }
            <div id="buttonsRow" className="shipButtonsRow">
              <button disabled={!this.state.isChecked || this.state.isLoading} className="yesButton" onClick={this.uploadInvoiceCallback}>Upload</button>
              <button className="cancelButton" onClick={this.cancelShipCallback}>Cancel</button>
            </div>
          </div>
        );
      }
      else {
        content = (
          <div>
            <h4 id="titleText" className="textMargins title">Are you sure you want to {this.props.modalType.toLowerCase()} this letter?</h4>
            <p id="messageBody" className="textMargins message">{message}</p>
            <div id="buttonsRow" className="buttonsRow">
              <button className="yesButton" onClick={this.props.yesCallback}>Yes</button>
              <button className="cancelButton" onClick={this.props.cancelCallback}>Cancel</button>
            </div>
          </div>
        );
      }

      return (
        <div id="modalBackground" className="background">
          <div id="modalContainer" className={containerClasses}>
            {content}
          </div>
        </div>
      );
    }
    else {
      return (<div />);
  	}
  }
}

export default Modal;
