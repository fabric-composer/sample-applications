import React, { Component } from 'react';
import '../../../stylesheets/css/main.css';
import Config from '../../../utils/config';

class TutorialPage extends Component {

    constructor() {
        super();
        this.config = new Config();
    }

    render() {
        return (
            <div id="tutorialPageContainer" className="tutorialPageContainer" >
            <h1 id="scenario">Scenario</h1>

            <p>In this sample you will take on the role of four participants to see how blockchain can be used to track letters of credit. These participants are:</p>

            <p><strong>Alice Hamilton</strong> - Owner of QuickFix IT, a company specialising in the sale of computers.</p>

            <p><strong>Bob Appleton</strong> - Owner of Conga Computers, a manufacturer of computers.</p>

            <p><strong>Matías</strong> - Employee of Bank of Dinero, the bank which Alice has an account with.</p>

            <p><strong>Ella</strong> - Employee of the Eastwood Banking, the bank which Bob has an account with.</p>

            <p>The above participants have varying roles in the scenario with Alice playing the <em>applicant</em>, Bob the <em>beneficiary</em>, Matías the <em>issuing bank</em> and Ella the <em>exporter bank</em>.</p>

            <p>In the scenario that this sample covers Alice and Bob have agreed that Alice will purchase computers from Bob's next shipment and have agreed a price for these. Alice unfortunately does not have enough money in her account to cover the entire cost of the purchase and therefore she is requesting a letter of credit to cover this cost from her Bank, Bank of Dinero. This sample will cover how this letter of credit is tracked using blockchain.</p>

            <h1 id="tutorial">Tutorial</h1>

            <h2 id="settingupthedemo">Setting up the demo</h2>

            <p>Open each participant's application in a seperate tab. <a href="/alice">Alice's banking app</a>, <a href="/matias">Matías' bank employee view</a>, <a href="/ella">Ella's bank employee view</a> and <a href="/bob">Bob's banking app</a>.</p>

            <h2 id="applyingforaletterofcredit">Applying for a letter of credit</h2>

            <p>On Alice's screen use the button to apply for a letter of credit.</p>

            <p>The letter of credit requires certain information, the details of the applicant (Alice), the details of the beneficiary (Bob), the details of the product it relates to and terms and conditions that must be met.</p>

            <p>Update the product details using the <strong>edit</strong> button. Enter <strong>computers</strong> for the type, <strong>100</strong> for the quantity and <strong>1200</strong> for the price per unit. Click save to confirm your changes.</p>

            <p>Review the terms and conditions then confirm the request for a letter of credit by clicking <strong>Start approval process</strong> and pressing <strong>Yes</strong> to the modal warning that Alice is agreeing to the terms of the letter and that it will be sent to her bank for approval.</p>

            <p>Note: For the purpose of this sample the details of Bob are prefilled in for the letter of credit.</p>

            <h2 id="issuingbankapproval">Issuing bank approval</h2>

            <p>Now that the letter of credit request has been sent, Matías must review it and accept or reject the application in his role at the Bank of Dinero.</p>

            <p>Navigate to Matías' screen and you will see that there is a new request for a letter of credit from Alice Hamilton. Click on the request to view it in full.</p>

            <p>Review the letter of credit request and accept the application by clicking I accept the application and pressing <strong>Yes</strong> to the modal warning that Matías is agreeing to the terms of the letter and that it will be sent to the exporting bank for their approval.</p>

            <h2 id="exportingbankapproval">Exporting bank approval</h2>

            <p>The letter of credit has now arrived at the exporting bank, Eastwood Banking, and requires their approval. It is Ella's responsibility to approve the letter of credit on behalf of Eastwood Banking.</p>

            <p>Navigate to Ella's screen and you will see that the letter of credit from Alice and approved by the Bank of Dinero requires review. Click on the request to view it in full.</p>

            <p>Review the product details and terms and conditions are acceptable and then accept the application by clicking <strong>I accept the application</strong> and pressing <strong>Yes</strong> to the modal warning that Ella is agreeing to the terms of the letter and that it will be sent to the beneficiary for their approval.</p>

            <h2 id="exporterapproval">Exporter approval</h2>

            <p>After the letter of credit has been approved by both the issuing bank and the exporting bank it is visible to Bob.</p>

            <p>Navigate to Bob's screen and click the arrow on the letter of credit to view it.</p>

            <p>Review the letter of credit and accept the application by clicking <strong>I accept the application</strong> and pressing <strong>Yes</strong> to the modal warning that Bob is agreeing to the terms of the letter.</p>

            <p>The letter of credit has now been accepted by all parties, and the transaction can continue.</p>

            <h2 id="declaringthegoodsasshipped">Declaring the goods as shipped</h2>

            <p>After Bob at Conga Computers has shipped the equipment to Alice at QuickFix IT, he can use his banking application to update the letter of credit to verify the goods shipment.</p>

            <p>In Bob's main banking view use the toggle on the letter of credit card to mark that the goods have been shipped. In the popup check the checkbox next to <strong>shipping-invoice.pdf</strong> and press upload. This writes to the letter of credit a hash of his shipping documents as proof.</p>

            <p>The letter of credit is visible to Alice at all steps, so she can see that the goods have been shipped.</p>

            <h2 id="declaringthegoodasreceived">Declaring the good as received</h2>

            <p>Upon receipt of the goods, Alice can mark the goods as received on the letter of credit.</p>

            <p>In Alice's main banking screen use the toggle on the letter of credit card to mark that the goods have been received.</p>

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

            <h1 id="nextsteps">Next steps</h1>

                <p>This sample works using <a target="_blank" href={this.config.playground.docURL}>{this.config.playground.name}</a>. Check out the model and business logic behind this sample <a target="_blank" href={this.config.playground.deployedURL}>here</a>, or browse the generated REST APIs <a target="_blank" href={this.config.restServer.explorer}>here</a>.</p>
            </div>
        );
    }
}

export default TutorialPage;