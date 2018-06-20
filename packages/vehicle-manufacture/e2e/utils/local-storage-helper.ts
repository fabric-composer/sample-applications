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

import { browser } from 'protractor';

export class LocalStorageHelper {
    static async getValue(key) {
        const value = await browser.executeScript("return window.localStorage.getItem('" + key + "');");
        return value.toString();
    };

    static get() {
        return browser.executeScript("return window.localStorage;");
    };

    static set(name, value) {
        return browser.executeScript(`window.localStorage.setItem('${name}', '${value}')`);
    }

    static clear() {
        browser.executeScript("return window.localStorage.clear();");
    };
};