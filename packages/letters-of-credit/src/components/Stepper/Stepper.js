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
import Step from '../../components/Step/Step.js'

class Stepper extends Component {
  constructor(props) {
		super(props);

		this.state = {
      steps: this.props.steps,
      activeStep: this.props.activeStep
		}

    this.config = new Config();
	}

  generateSteps(){
    let stepsJSX = [];
    let stepType = "completedStep";

    for (var i = 0; i < this.state.steps.length; i++){
      let step = this.state.steps[i];
      let stepPos;
      if (i === 0){
        stepPos = "first";
      }
      else if (i === this.state.steps.length-1){
        stepPos = "last";
      }
      if (i === this.state.activeStep){
        stepsJSX.push(<Step stepType={"activeStep"} stepNumber={i} stepMessage={step} stepPosition={stepPos}/>);
        stepType = "uncompletedStep";
      }
      else {
        stepsJSX.push(<Step stepType={stepType} stepNumber={i} stepMessage={step} stepPosition={stepPos}/>);
      }
    }
    return stepsJSX;
  }

  render() {
    let steps = this.generateSteps();
    return (
      <div className ="Stepper">
        {steps.map((jsx) => {
          return (jsx);
        })}
      </div>
    );
  }
}

export default Stepper;
