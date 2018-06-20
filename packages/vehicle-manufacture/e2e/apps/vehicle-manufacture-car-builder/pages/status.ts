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

import { OperationsHelper } from "../../../utils/operations-helper";
import { VisibilityHelper } from "../../../utils/visibility-helper";
import { element, by } from "protractor";

export class Status extends VisibilityHelper {
    static visibilityMarker = 'page-status';

    static stages = {
        order: '#orderReceived',
        manufacture: '#manufactureComplete',
        vin: '#vinAssigned',
        owner: '#ownerIssued',
        delivered: '#delivered'
    }

    static async stageComplete(name) {
        let returnBool = true;

        const card = element(by.css(this.stages[name]));
        const classList = await card.getAttribute('class');

        if (classList.includes('selected')) {
            if (name !== 'delivered') {
                const image = card.element(by.css('.tick-circle'));

                if (!await image.isDisplayed()) {
                    returnBool = false;
                }
            }
        } else {
            returnBool = false;
        }

        return returnBool;
    }

    static async getOrderId() {
        return await OperationsHelper.retrieveTextFromElement(element(by.css('#orderId')));
    }
}