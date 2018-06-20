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
import Config from '../../utils/config';
import '../../stylesheets/css/main.css';

class Step extends Component {
  constructor(props) {
		super(props);

		this.state = {
      stepType: this.props.stepType,
      stepNumber: this.props.stepNumber,
      stepMessage: this.props.stepMessage,
      stepPosition: this.props.stepPosition
		}

    this.config = new Config();
	}

  generateStep(){
    let stepJSX = [];
    console.log(this.state.stepPosition)
    let firstConnectorClass = this.state.stepPosition === "first" ? "blankStepConnector" : "stepConnector";
    let lastConnectorClass = this.state.stepPosition === "last" ? "blankStepConnector" : "stepConnector";
    if (this.state.stepType === "activeStep"){
      stepJSX.push(
        <div className="nothing">
          <div className="stepInfo">
            <div className="stepInfoMessage">
              <p className="stepNumberText">Step {this.state.stepNumber + 1}</p><br/>
              <p className="stepMessageText">{this.state.stepMessage}</p>
            </div>
            <div className="stepInfoTick"/>
          </div>
          <div className="nodeContainer">
            <div className={firstConnectorClass}/>
            <div className={this.state.stepType}/>
            <div className={lastConnectorClass}/>
          </div>
        </div>
      );
    }
    else {
      stepJSX.push(
        <div>
          <div className="nodeContainer">
            <div className={firstConnectorClass}/>
            <div className={this.state.stepType}/>
            <div className={lastConnectorClass}/>
          </div>
        </div>
      );
    }
    return stepJSX;
  }

  render() {
    let step = this.generateStep();
    return (
      <div className="stepContainer">
        {step.map((jsx) => {
          return (jsx);
        })}
      </div>
    );
  }
}

export default Step;
