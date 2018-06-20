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

import { Constants } from '../../../constants';

import { VisibilityHelper } from "../../../utils/visibility-helper";
import { OperationsHelper } from "../../../utils/operations-helper";

import { browser, element, by } from "protractor";

export class Dashboard extends VisibilityHelper {
    static visibilityMarker = '.bc-man-dashboard';

    static manufactureButton = '#start-manufacture';

    static stagePassedMarker = 'status-green';

    static transactionSpacer = 5000; // time expected between transactions in ms

    static async hasNewOrder() {
        return this.hasChild(this.manufactureButton, 'No new orders found');
    }

    static async hasOrder() {
        return this.hasChild('.big-card', 'No orders found')
    }

    static async processOrder() {
        await OperationsHelper.click(element(by.css(this.manufactureButton)));
    }

    static async productionComplete() {
        return browser.wait(async () => {
            try {
                let chassis = element(by.css('#chassis'));
                let chassisClasses = await chassis.getAttribute('class');

                let interior = element(by.css('#interior'));
                let interiorClasses = await interior.getAttribute('class');

                let paint = element(by.css('#paint'));
                let paintClasses = await interior.getAttribute('class');

                return chassisClasses.includes(this.stagePassedMarker) && interiorClasses.includes(this.stagePassedMarker) && paintClasses.includes(this.stagePassedMarker);
            } catch (err) {
                return false;
            }
        }, Constants.shortWait);
    }

    static async vinAssigned() {
        return browser.wait(async () => {
            try {
                let vin = element(by.css('#vin'));
                let vinClasses = await vin.getAttribute('class');

                return vinClasses.includes(this.stagePassedMarker);
            } catch (err) {
                return false;
            }
        }, Constants.shortWait);
    }

    static async ownerAssigned() {
        return browser.wait(async () => {
            try {
                let owner = element(by.css('#owner'));
                let ownerClasses = await owner.getAttribute('class');

                return ownerClasses.includes(this.stagePassedMarker);
            } catch (err) {
                return false;
            }
        }, Constants.shortWait);
    }

    static async delivered() {
        return browser.wait(async () => {
            try {
                let delivered = element(by.css('#delivered'));
                let deliveredClasses = await delivered.getAttribute('class');

                return deliveredClasses.includes(this.stagePassedMarker);
            } catch (err) {
                return false;
            }
        }, Constants.shortWait);
    }

    static async getOrderDetails() {
        let trim = await OperationsHelper.retrieveTextFromElement(element(by.css('#order-trim')));
        let interior = await OperationsHelper.retrieveTextFromElement(element(by.css('#order-interior')));
        let colour = await OperationsHelper.retrieveTextFromElement(element(by.css('#order-colour')));

        let extraFields = element.all(by.css('#order-extras .field'));

        let extras = [];
        for (let i = 0; i < await extraFields.count(); i++) {
            const field = extraFields.get(i);

            extras.push(await OperationsHelper.retrieveTextFromElement(field));
        }

        return {
            trim: trim,
            interior: interior,
            colour: colour,
            extras: extras
        }
    }
}