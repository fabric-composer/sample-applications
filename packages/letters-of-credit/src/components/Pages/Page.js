import React, { Component } from 'react';
import '../../stylesheets/css/main.css';
import Modal from '../Modal/Modal.js';

class Page extends Component {
  render() {
    return (
      <div id="pageContainer" className="Page">
        <Modal />
        {this.props.contents}
      </div>
    );
  }
}

export default Page;
