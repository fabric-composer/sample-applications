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

import { element, by } from 'protractor';

import { VisibilityHelper } from "../../../utils/visibility-helper";
import { OperationsHelper } from '../../../utils/operations-helper';

export class BlockchainView extends VisibilityHelper {
    static visibilityMarker = '.bc-view';

    static blockIdentifier = '.bc-view-block';

    static async hasBlock() {
        return this.hasChild(this.blockIdentifier, 'No blocks found');
    }

    static async hasBlocks(number) {
        return this.hasNChildren(this.blockIdentifier, number, `Did not find ${number} blocks`)
    }

    static async getBlocks() {
        let blocks = element.all(by.css(this.blockIdentifier));

        let returnObj = [];

        for (let i = 0; i < await blocks.count(); i++) {
            let blockText = await OperationsHelper.retrieveTextFromElement(blocks.get(i));
            let blockTextArr = blockText.split('\n');

            returnObj.push({
                type: blockTextArr[3],
                status: blockTextArr[4]
            });
        }

        return returnObj;
    }
}