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

import { Constants } from '../constants';

export abstract class VisibilityHelper {

    static visibilityMarker: string;
    static visibilityMarkerNotSet = new Error('You must set a value for visibility marker.');

    static waitToAppear() {
        if (!this.visibilityMarker) {
            throw this.visibilityMarkerNotSet;
        }

        browser.wait(async () => {
            try {
                return await this.isVisible();
            } catch (err) {
                return false;
            }
        }, Constants.shortWait);
    }

    static waitToDisappear() {
        if (!this.visibilityMarker) {
            throw this.visibilityMarkerNotSet;
        }

        browser.wait(async () => {
            try {
                return ! (await this.isVisible());
            } catch (err) {
                return true;
            }
        }, Constants.shortWait);
    }

    static async isVisible() {
        if (!this.visibilityMarker) {
            throw this.visibilityMarkerNotSet;
        }

        let el;
        if (this.visibilityMarker.charAt(0) === '.' || this.visibilityMarker.charAt(0) === '#') {
            el = element(by.css(this.visibilityMarker));
        } else {
            el = element(by.tagName(this.visibilityMarker));
        }

        if (await el.isPresent() && await el.isDisplayed()) {
            return true;
        } else {
            return false;
        } 
    }

    protected static async hasChild(childIdentifier, errorMessage) {
        return browser.wait(async () => {
            try {
                let el = element(by.css(childIdentifier));
                return await el.isPresent() && await el.isDisplayed();
            } catch (err) {
                return false;
            }
        }, Constants.shortWait, errorMessage);
    }

    protected static async hasNChildren(childIdentifier, n, errorMessage) {
        return browser.wait(async () => {
            try {
                let el = element.all(by.css(childIdentifier));
                let count = 0;
                for (let i = 0; i < await el.count(); i++) {
                    if (await el.isPresent() && await el.isDisplayed()) {
                        count++;
                    }
                }
                return count >= n;
            } catch (err) {
                return false;
            }
        }, Constants.shortWait, errorMessage);
    }
}