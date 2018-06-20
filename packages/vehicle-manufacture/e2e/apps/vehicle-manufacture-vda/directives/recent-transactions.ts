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

import { browser, element, by } from 'protractor';

import { VisibilityHelper } from "../../../utils/visibility-helper";

import { Constants } from '../../../constants';
import { OperationsHelper } from '../../../utils/operations-helper';

export class RecentTransactions extends VisibilityHelper {
    static visibilityMarker = '.bc-vda-recent-transactions-table-container';

    static transactionIdentifier = '.transaction';

    static hasTransaction() {
        return this.hasChild(this.transactionIdentifier, 'No transactions found');
    }

    static async hasTransactions(number) {
        return this.hasNChildren(this.transactionIdentifier, number, `Did not find ${number} transactions`);
    }

    static async getTransactions() {
        let txns = element.all(by.css(this.transactionIdentifier));

        let returnObj = [];

        for (let i = 0; i < await txns.count(); i++) {
            let txnText = await OperationsHelper.retrieveTextFromElement(txns.get(i));
            console.log('TRANSACTION TEXT', txnText);
            let txnTextArr = txnText.split(' ');

            returnObj.push({
                type: txnTextArr[txnTextArr.length - 2],
                participant: txnTextArr[txnTextArr.length - 1]
            });
        }

        return returnObj;
    }
}