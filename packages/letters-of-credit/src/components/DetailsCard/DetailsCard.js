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
import { connect } from "react-redux";
import { getProductDeatils } from "../../actions/actions";
import { getRules } from "../../actions/actions";

class DetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      editable: false
    }
  }

  switchEditable() {
    const currentState = this.state.editable;
    this.setState({
      editable: !currentState
    });
  }

  handleChange(index, event) {
    const data = this.state.data;
    data[index] = ((this.props.type === "Rules") ? {ruleText: event.target.value} : event.target.value);

    this.setState({
      data: data
    });

    if(this.props.type === "Product") {
      this.props.getProductDeatils({
        type: this.state.data[1],
        quantity: parseInt(this.state.data[2], 10),
        pricePerUnit: parseFloat(this.state.data[3], 10),
        total: parseFloat(this.state.data[2]*this.state.data[3], 10)
      });
    }
  }

  render() {
    let mainHeadingTxt = this.props.data[0];
    let jsx;

    let containerClasses = this.props.disabled ? "cardContainer disabled" : "cardContainer";

    switch(this.props.type) {
      case 'Person':
        jsx = (
          <div>
            <span class="subheadingSpan, topHeading">NAME</span>
            <span class="subheadingSpan">{this.state.data[1]}</span>
            <span class="subheadingSpan, topHeading">COMPANY NAME</span>
            <span class="subheadingSpan">{this.state.data[2]}</span>
            <span class="subheadingSpan, topHeading">IBAN</span>
            <span class="subheadingSpan">{this.state.data[3]}</span>
            <span class="subheadingSpan, topHeading">SWIFT CODE</span>
            <span class="subheadingSpan">{this.state.data[4]}</span>
            <span class="subheadingSpan, topHeading">BANK NAME</span>
            <span class="subheadingSpan">{this.state.data[5]}</span>
          </div>
        );
        break;
      case 'Product':
        let currency, amount;
        if (this.props.user === 'alice' || this.props.user === 'matias') {
          currency = '€';
          amount = this.state.data[3];
        } else {
          currency = '$'
          amount = this.state.data[3] * 1.15;
        }

        jsx = (
          <div>
            <span class="subheadingSpan, topHeading">TYPE</span>
            { (this.state.editable) ? <input class="subheadingSpan" type="text" onChange={this.handleChange.bind(this, 1)} defaultValue={this.state.data[1]} /> : <span class="subheadingSpan">{this.state.data[1]}</span> }
            <span class="subheadingSpan, topHeading">QUANTITY</span>
            { (this.state.editable) ? <input class="subheadingSpan" type="number" min="0" onChange={this.handleChange.bind(this, 2)} defaultValue={this.state.data[2]} /> : <span class="subheadingSpan">{this.state.data[2] ? this.state.data[2] : "0"}</span> }
            <span class="subheadingSpan, topHeading">PRICE PER UNIT</span>
            { (this.state.editable) ? <input class="subheadingSpan" type="number" min="0" onChange={this.handleChange.bind(this, 3)} defaultValue={this.state.data[3]} /> : <span class="subheadingSpan">{currency + (this.state.data[3] ? amount.toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00")}</span> }
            <span class="subheadingSpan, topHeading">TOTAL</span>
            <span class="subheadingSpan">{currency + (this.state.data[2]*amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        );
        break;
      case 'Rules':
        mainHeadingTxt = "Terms of Letter of Credit";
        if(this.state.editable) {
          jsx = (
            <ul>
              {this.state.data.map(function(rule, i) {
                return <li><input type="text" onChange={this.handleChange.bind(this, i)} defaultValue={this.state.data[i].ruleText} /></li>;
              }, this)}
            </ul>
          );
        }
        else {
          jsx = (
            <ul>
              {this.state.data.map(function(rule) {
                return <li>{rule.ruleText}</li>;
              })}
            </ul>
          );
        }
        break;
    }

    let buttonTxt = this.state.editable ? "Save" : "Edit";
    let editButtonStyle = this.state.editable ? { float: 'right' } : {};
    let styles = this.props.type === 'Rules' ? "outerDiv rules" : "outerDiv"; 
    
    return (
      <div className={styles}>
        <div class={containerClasses}>
          <h5>{mainHeadingTxt}</h5>
          {jsx}
        </div>
        { this.props.canEdit && <button className="editButton" onClick={this.switchEditable.bind((this))}><span style={editButtonStyle}>{buttonTxt}</span></button> }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProductDeatils: productDetails => dispatch(getProductDeatils(productDetails)),
    getRules: rules => dispatch(getRules(rules))
  };
};

export default connect(null, mapDispatchToProps)(DetailsCard);
