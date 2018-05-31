import React from 'react';
import '../../stylesheets/css/main.css';
import Block from '../../components/Block/Block.js';

class BlockChainDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    }
  }

  getSpecificInfo() {
    let transactions = [];
    this.props.transactions.map((tx, index) => {
      let transaction = {
        name: "",
        timestamp: tx.transactionTimestamp
      }
      if (tx.transactionType === 'org.example.loc.InitialApplication') {
        transaction.name = 'Created by Alice';
      } else if (tx.transactionType === 'org.example.loc.Approve') {
        switch (index) {
          case 1: 
            transaction.name = 'Approved by Matías'; 
            break;
          case 2:
            transaction.name = 'Approved by Ella';
            break;
          case 3:
            transaction.name = 'Approved by Bob';
            break;
          default: 
            transaction.name = 'Approved';
            break;
        }
      } else if (tx.transactionType === 'org.example.loc.ShipProduct') {
        transaction.name = 'Shipped by Bob';
      } else if (tx.transactionType === 'org.example.loc.ReceiveProduct') {
        transaction.name = 'Received by Alice';
      } else if (tx.transactionType === 'org.example.loc.ReadyForPayment') {
        transaction.name = 'Paid by Matías';
      } else if (tx.transactionType === 'org.example.loc.Close') {
        transaction.name = 'Closed by Ella';
      } else {
        transaction.name = 'Rejected';
      }
      transactions.push(transaction);
    });
    return transactions;
  }

  addLeadingZero(number) {
    return (number < 10) ? "0" + number : number;
  }

  render() {
    let transactions = this.getSpecificInfo();
    let blocks = [];
    if(transactions.length) {
      for (let i = transactions.length; i > 0; i--) {
        let name = transactions[i-1].name;
        let blockNumber = this.addLeadingZero(i);
        let dateTime = new Date(transactions[i-1].timestamp);
        let date = dateTime.getFullYear() + '-' + this.addLeadingZero(dateTime.getMonth()+1) + '-' + this.addLeadingZero(dateTime.getDate());
        let time = dateTime.toTimeString().split(' ')[0];
        blocks.push(<Block transactionDetails={name} date={date} time={time} number={blockNumber}/>);

      }
    }

    return (
        <div className="BlockChainDisplay">
          <div className="greyBlock">
            <div className="greyBlockLine"/>
          </div>
          {blocks}
        </div>
    );
  }
}

export default BlockChainDisplay;
