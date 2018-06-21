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
import { OperationsHelper } from "../../../utils/operations-helper";
import { element, by } from "protractor";

export class Header extends VisibilityHelper {
    static visibilityMarker = '.bc-vda-header';

    static async getNumberRegistered() {
        return await OperationsHelper.retrieveTextFromElement(element(by.css('#registeredVehicles')));
    }

    static async getNumberVinAssigned() {
        return await OperationsHelper.retrieveTextFromElement(element(by.css('#vinAssigned')));
    }

    static async getNumberOwnerIssued() {
        return await OperationsHelper.retrieveTextFromElement(element(by.css('#ownerIssued')));
    }
}