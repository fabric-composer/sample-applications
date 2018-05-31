import React, { Component } from 'react';
import '../../stylesheets/css/main.css';

class Table extends Component {
	render() {
  	return(
  		<div id="tableContainer" className={this.props.styling}>
  			<div id="headerBar" className="headerBar">
  				<span className="locOrdersText"> Letters of Credit Applications </span>
  			</div>
  			<table className="bankTable">
  				<tbody>
  					<tr className="tableHeaders">
  						<th>Ref number</th>
  						<th>Applicant Name</th>
  						<th>Business Account</th>
  						<th>Status</th>
  					</tr>
  					{this.props.rows}
  				</tbody>
  			</table>
  		</div>
		);
	}
}

export default Table;
