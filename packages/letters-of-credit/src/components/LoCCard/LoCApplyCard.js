import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../../stylesheets/css/main.css';

class LoCApplyCard extends Component {
  constructor(props) {
		super(props);
		this.state = {
      redirect: false
		}
    this.handleOnClick = this.handleOnClick.bind(this);
	}

  handleOnClick() {
    this.props.callback({}, true);
    this.setState({redirect: true});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.props.user + "/loc/create"} />;
    }
    return (
      <div className="LoCCard noBorder">
        <h2>{this.props.user === 'alice' ? 'Letter of Credit Application' : 'Letter of Credit Applications'}</h2>
        <p>A letter of credit is issued by a bank to another bank (especially one in a different country) to serve as a guarantee for payments made to a specified person under specified conditions.</p>
        {this.props.user === 'alice' && 
          <button className="viewButton applyButton" onClick={() => this.handleOnClick()}>Apply for a Letter of Credit</button>
        }
      </div>
    );
  }
}


export default LoCApplyCard;