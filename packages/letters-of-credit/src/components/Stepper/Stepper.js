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
