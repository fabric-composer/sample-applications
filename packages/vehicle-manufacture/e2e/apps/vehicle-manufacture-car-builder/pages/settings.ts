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

import { Login } from './login';

import { OperationsHelper } from '../../../utils/operations-helper';
import { VisibilityHelper } from '../../../utils/visibility-helper';

export class Settings extends VisibilityHelper {
    static visibilityMarker = 'page-settings';

    static updateButton = '#updateBtn';
    static httpTextbox = '#restHttp';
    static wsTextbox = '#restWs';

    static async openPage() {
        if (Login.isVisible()) {
            await OperationsHelper.click(element(by.css('#cog')));
            await this.waitToAppear();
        } else {
            throw new Error('You can only open settings from login page')
        }
    }

    static async getConfig() {
        const httpURL = await OperationsHelper.retrieveValueFromElement(element(by.css(this.httpTextbox)));
        const webSocketURL = await OperationsHelper.retrieveValueFromElement(element(by.css(this.wsTextbox)));

        return {
            restServer: {
                httpURL: httpURL,
                webSocketURL: webSocketURL
            }
        }
    }

    static async setConfig(httpURL, webSocketURL) {
        const httpTextboxEl = element(by.css(this.httpTextbox));
        const wsTextboxEl = element(by.css(this.wsTextbox));

        await httpTextboxEl.clear();
        await wsTextboxEl.clear();

        // break up string it can't handle super fast typing
        for (let i:number = 0; i < httpURL.length; i++) {
            await httpTextboxEl.sendKeys(httpURL.charAt(i));
            await browser.sleep(50);
        }
        
        for (let i:number = 0; i < webSocketURL.length; i++) {
            await wsTextboxEl.sendKeys(webSocketURL.charAt(i));
            await browser.sleep(50);
        }

        await OperationsHelper.click(element(by.css(this.updateButton)));

        await Login.waitToAppear();

        await Settings.waitToDisappear();
    }
}