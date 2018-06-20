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
