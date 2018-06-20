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
import '../../../stylesheets/css/main.css';
import Config from '../../../utils/config';

class TutorialPage extends Component {

    constructor() {
        super();
        this.config = new Config();
    }

    componentDidMount() {
        document.title = "Tutorial";
    }

    render() {
        return (
            <div id="tutorialPageContainer" className="tutorialPageContainer" >

                <div id="contents" >
                    <h1>Letters of Credit Tutorial</h1>
                    <ul>
                        <li className="top-level" >
                            <a href="#scenario" >Scenario</a>
                        </li>
                        <li className="top-level parent" >
                            <a href="#tutorial" >Tutorial</a>
                            <ul>
                                <li>
                                    <a href="#settingupthedemo" >Setting up the demo</a>
                                </li>
                                <li>
                                    <a href="#applyingforaletterofcredit" >Applying for a letter of credit</a>
                                </li>
                                <li>
                                    <a href="#issuingbankapproval" >Issuing bank approval</a>
                                </li>
                                <li>
                                    <a href="#exportingbankapproval" >Exporting bank approval</a>
                                </li>
                                <li>
                                    <a href="#exporterapproval" >Exporter approval</a>
                                </li>
                                <li>
                                    <a href="#declaringthegoodsasshipped" >Declaring the goods as shipped</a>
                                </li>
                                <li>
                                    <a href="#issuingpayment" >Issuing payment</a>
                                </li>
                                <li>
                                    <a href="#closingtheletterofcredit" >Closing the Letter of Credit</a>
                                </li>
                                <li>
                                    <a href="#confirmingcompletion" >Confirming completion</a>
                                </li>
                            </ul>
                        </li>
                        <li className="top-level" >
                            <a href="#benefitofblockchain" >Benefit of blockchain</a>
                        </li>
                        <li className="top-level" >
                            <a href="#nextsteps" >Next Steps</a>
                        </li>
                    </ul>
                </div>

                <div id="tutorialContainer" >
                    <h1 id="scenario">Scenario</h1>

                    <p>In this sample you will take on the role of four participants to see how blockchain can be used to track letters of credit. These participants are:</p>

                    <p><strong>Alice Hamilton</strong> - Owner of QuickFix IT, a company specialising in the sale of computers.</p>

                    <p><strong>Bob Appleton</strong> - Owner of Conga Computers, a manufacturer of computers.</p>

                    <p><strong>Matías</strong> - Employee of Bank of Dinero, the bank which Alice has an account with.</p>

                    <p><strong>Ella</strong> - Employee of the Eastwood Banking, the bank which Bob has an account with.</p>

                    <p>The above participants have varying roles in the scenario with Alice playing the <em>applicant</em>, Bob the <em>beneficiary</em>, Matías the <em>issuing bank</em> and Ella the <em>exporter bank</em>.</p>

                    <p>In the scenario that this sample covers Alice and Bob have agreed that Alice will purchase computers from Bob's next shipment (due to arrive in 14 days) and have agreed a price for these. Alice unfortunately does not have enough money in her account to cover the entire cost of the purchase and therefore she is requesting a letter of credit to cover this cost from her Bank, Bank of Dinero. This sample will cover how this letter of credit is tracked using blockchain.</p>

                    <h1 id="tutorial">Tutorial</h1>

                    <h2 id="settingupthedemo">Setting up the demo</h2>

                    <p>Open each participant's application in a seperate tab. <a href="/alice">Alice's banking app</a>, <a href="/matias">Matías' bank employee view</a>, <a href="/ella">Ella's bank employee view</a> and <a href="/bob">Bob's banking app</a>.</p>

                    <h2 id="applyingforaletterofcredit">Applying for a letter of credit</h2>

                    <p>On Alice's screen use the button to apply for a letter of credit.</p>

                    <p>The letter of credit requires certain information, the details of the applicant (Alice), the details of the beneficiary (Bob), the details of the product it relates to and terms and conditions that must be met.</p>

                    <p>Update the product details using the <strong>edit</strong> button. Enter <span class="code">computers</span> for the type, <span class="code">100</span> for the quantity and <span class="code">1200</span> for the price per unit. Click <strong>save</strong> to confirm your changes.</p>

                    <p>Update the terms and conditions to suit the scenario using the <strong>edit</strong> button and then change the second term to <span class="code">14</span> days. Press the <strong>save</strong> button to confirm the changes.</p>

                    <p>Confirm the request for a letter of credit by clicking <strong>Start approval process</strong> and pressing <strong>Yes</strong> to the modal warning that Alice is agreeing to the terms of the letter and that it will be sent to her bank for approval.</p>

                    <p>On Alice's screen you should now see a card containing the letter of credit.</p>

                    <p><strong>NOTE:</strong> For the purpose of this sample the details of Bob are prefilled in for the letter of credit.</p>

                    <h2 id="issuingbankapproval">Issuing bank approval</h2>

                    <p>Now that the letter of credit request has been sent, Matías must review it and accept or reject the application in his role at the Bank of Dinero.</p>

                    <p>Navigate to Matías' screen and you will see that there is a new request for a letter of credit from Alice Hamilton. Click on the request to view it in full.</p>

                    <p>Within the letter of credit screen the bar at the top show Matías the current status of the letter. On the right hand side of the screen Matías is able to see the history stored in the blockchain of the letter of credit.</p> 

                    <p>Review the letter of credit request and accept the application by clicking <strong>I accept the application</strong> and pressing <strong>Yes</strong> to the modal warning that Matías is agreeing to the terms of the letter and that it will be sent to the exporting bank for their approval.</p>

                    <h2 id="exportingbankapproval">Exporting bank approval</h2>

                    <p>The letter of credit has now arrived at the exporting bank, Eastwood Banking, and requires their approval. It is Ella's responsibility to approve the letter of credit on behalf of Eastwood Banking.</p>

                    <p>Navigate to Ella's screen and you will see that the letter of credit from Alice and approved by the Bank of Dinero requires review. Click on the request to view it in full.</p>

                    <p>Review the product details and terms and conditions are acceptable, notice that the currency has been converted to Bob's local currency. Accept the application by clicking <strong>I accept the application</strong>. Press <strong>Yes</strong> to the modal warning that Ella is agreeing to the terms of the letter and that it will be sent to the beneficiary for their approval.</p>

                    <h2 id="exporterapproval">Exporter approval</h2>

                    <p>After the letter of credit has been approved by both the issuing bank and the exporting bank it is visible to Bob.</p>

                    <p>Navigate to Bob's screen and click the arrow on the letter of credit to view it.</p>

                    <p>Review the letter of credit and accept the application by clicking <strong>I accept the application</strong> and pressing <strong>Yes</strong> to the modal warning that Bob is agreeing to the terms of the letter.</p>

                    <p>The letter of credit has now been accepted by all parties, and the transaction can continue.</p>

                    <h2 id="declaringthegoodsasshipped">Declaring the goods as shipped</h2>

                    <p>After Bob at Conga Computers has shipped the equipment to Alice at QuickFix IT, he can use his banking application to update the letter of credit to verify the shipment.</p>

                    <p>In Bob's home screen use the toggle on the letter of credit card to mark that the goods have been shipped. In the popup check the checkbox next to <strong>shipping-invoice.pdf</strong> and press upload. This writes to the letter of credit a hash of his shipping documents as proof.</p>

                    <p>The letter of credit is visible to Alice at all steps, so she can see that the goods have been shipped.</p>

                    <h2 id="declaringthegoodasreceived">Declaring the good as received</h2>

                    <p>Upon receipt of the goods, Alice can mark the goods as received on the letter of credit.</p>

                    <p>In Alice's home screen use the toggle in the letter of credit card to mark that the goods have been received.</p>

                    <p>Accepting the order and updating the letter of credit, Alice agrees that what she has received matches the terms specified in the letter of credit.</p>

                    <h2 id="issuingpayment">Issuing payment</h2>

                    <p>After Alice has verified receipt of the goods, the issuing bank can approve the payment. The issuing bank will perform their own check of the goods and pay the letter of credit if they agree that they match the terms of the letter.</p>

                    <p>On Matías' screen click the letter of credit and press <strong>Ready for payment</strong> and press <strong>Yes</strong> to the modal warning that Matías is agreeing the goods arrived matching the terms of the letter and the balance should be transferred.</p>

                    <h2 id="closingtheletterofcredit">Closing the Letter of Credit</h2>

                    <p>The issuing bank has now confirmed that they are happy with the goods and have made the payment, the exporting bank can close the letter of credit and deposit the funds in the beneficiary's account, namely Bob from Conga Computers.</p>

                    <p>In Ella's screen click the letter of credit and press <strong>Close this letter of credit</strong>.</p>

                    <h2 id="confirmingcompletion">Confirming completion</h2>

                    <p>Now that the letter of credit is closed Bob will have received the full value of the goods.</p>

                    <p>On Bob's screen review his bank balance to ensure that the payment has been made.</p>

                    <h1 id="benefitofblockchain">Benefit of blockchain</h1>

                    <ul>
                        <li><strong>Clarity</strong> - Using blockchain there is a single source for each participant to get data on the letter of credit. This means all participants have the same up to date view of the status of the letter.</li>

                        <li><strong>Speed</strong> - Each participant can update the letter when they are required without the need for back and forth messages with other participants to ensure that they have the latest details about the letter.</li>

                        <li><strong>Security</strong> - With a single source of truth participants can see the entire history of other participants' actions around letters of credit. Using this they can perform risk analysis to decide whether or not to approve a letter of credit relating to them.</li> 
                    </ul>
                    <h1 id="nextsteps">Next steps</h1>

                    <p>This sample works using <a target="_blank" href={this.config.playground.docURL}>{this.config.playground.name}</a>. Check out the model and business logic behind this sample <a target="_blank" href={this.config.playground.deployedURL}>here</a>, or browse the generated REST APIs <a target="_blank" href={this.config.restServer.explorer}>here</a>.</p>
                </div>
            </div>
        );
    }
}

export default TutorialPage;