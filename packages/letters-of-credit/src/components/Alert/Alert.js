import React from 'react';
import '../../stylesheets/css/main.css';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: this.props.amount,
      show: this.props.show
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      show: false
    });
  }

  render() {
    let containerStyle = (this.state.show) ? "alertContainer" : "alertContainer invisible";
    return (
      <div className={containerStyle}>
        <div className="tick"/>
        <div className="alert">
          <p>Your balance has increased by <b>{"$" + this.state.amount}</b>.</p>
          <button onClick={this.handleClick} disabled={!this.state.show}>×</button>
        </div>
      </div>
    );
  }
}

export default Alert;
