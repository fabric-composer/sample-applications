import React from 'react';
import '../../stylesheets/css/main.css';

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionDetails: this.props.transactionDetails,
      date: this.props.date,
      time: this.props.time,
      number: this.props.number
    };
  }

  render() {
    return (
      <div className="Block">
        <div className="BlockLine"></div>
        <div className="BlockText">
          <p>{this.state.transactionDetails}</p>
          <p>{this.state.date}</p>
          <p>{this.state.time}</p>
        </div>
      </div>
    );
  }
}

export default Block;
