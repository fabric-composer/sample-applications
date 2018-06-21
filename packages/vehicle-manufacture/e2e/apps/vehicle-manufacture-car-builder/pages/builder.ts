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

import { VisibilityHelper } from "../../../utils/visibility-helper";
import { OperationsHelper } from "../../../utils/operations-helper"
import { element, by, browser, ExpectedConditions } from "protractor";
import { Constants } from "../constants";

export class Builder extends VisibilityHelper {
    static visibilityMarker = 'page-builder';

    private static options = {
        trim: {
            position: 0,
            optionSelector: '.option-item',
            optionTextSelector: 'h2'
        },
        colour: {
            position: 1,
            optionSelector: '.option-colour',
            optionTextSelector: 'h4'
        },
        interior: {
            position: 2,
            optionSelector: '.option-interior',
            optionTextSelector: 'h4'
        },
        extras: {
            position: 3,
            optionSelector: '.option-item',
            optionTextSelector: 'h2'
        },
    }

    private static purchaseButtonId = '#purchase';

    static async getCarType() {
        return OperationsHelper.retrieveTextFromElement(element(by.css('#car-type')));
    }

    static async setOption(optionName, optionValue) {
        const card = element.all(by.css(`.${Constants.classes.card.expandable}`)).get(this.options[optionName].position);
        const cardClasses = await card.getAttribute('class');
        const options = card.all(by.css(this.options[optionName].optionSelector));
        
        if (!cardClasses.includes(Constants.classes.card.expanded)) {
            await OperationsHelper.click(card);
            browser.wait(ExpectedConditions.elementToBeClickable(options.last()));
        }

        for (let i = 0; i < await options.count(); i++) {
            const option = options.get(i);
            const text = await OperationsHelper.retrieveTextFromElement(option.element(by.tagName(this.options[optionName].optionTextSelector)))

            if (text === optionValue) {
                await OperationsHelper.click(option);
                break;
            }
        }
    }

    static async getOption(optionName) {
        const card = element.all(by.css(`.${Constants.classes.card.expandable}`)).get(this.options[optionName].position);
        const h3 = card.element(by.tagName('h3'));
        return await OperationsHelper.retrieveTextFromElement(h3.element(by.css('.car-option-selected')));
    }

    static async canPlaceOrder() {
        if (await element(by.css(this.purchaseButtonId)).getAttribute('disabled')) {
            return false;
        } else {
            return true;
        }
    }

    static async getPlaceOrderText() {
        return await OperationsHelper.retrieveTextFromElement(element(by.css(this.purchaseButtonId)));
    }

    static async placeOrder() {
        await OperationsHelper.click(element(by.css(this.purchaseButtonId)));
    }
}