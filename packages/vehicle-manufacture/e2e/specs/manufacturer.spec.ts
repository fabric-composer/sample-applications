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

import {} from 'jasmine';
import { browser } from 'protractor';

import { Constants } from '../constants';

import { Dashboard } from '../apps/vehicle-manufacture-manufacturing/views/dashboard';

import { ComposerHelper } from '../utils/composer-helper';
import { LocalStorageHelper } from '../utils/local-storage-helper';
import { TransactionGenerator } from '../utils/transaction-generator';

describe('Manufacture App', () => {

    let fabricTest = browser.params.fabricTest === 'true' ? true : false;

    beforeAll(() => {
        // Important angular configuration and initial step passage to reach editor
        browser.waitForAngularEnabled(false);
        browser.get(Constants.apps.manufacturer.url);
    });

    afterAll(() => {
        browser.waitForAngularEnabled(true);
    });

    describe('Build Vehicle', () => {
        it ('should load the vehicle manufacturer', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('Manufacturer');

            await Dashboard.waitToAppear();
        });

        if (fabricTest) {
            it ('should ignore previous transactions created by car spec', async () => {
                await LocalStorageHelper.set("ignoreTxnsBefore", new Date());

                browser.get(Constants.apps.manufacturer.url);

                try {
                    await Dashboard.hasOrder();
                    fail('Order was found');
                } catch (err) {
                    expect(err.message).toMatch(/No orders found/);
                }
             });

            it ('should create a card for a new order', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.placeOrder('MANUFACTURER_ORDER'));

                await Dashboard.hasNewOrder();
            });

            it ('should let the manufacturer create the vehicle and show updates on the page', async () => {
                await Dashboard.processOrder();

                browser.sleep(Dashboard.transactionSpacer);

                await Dashboard.productionComplete();

                browser.sleep(Dashboard.transactionSpacer);

                await Dashboard.vinAssigned();

                browser.sleep(Dashboard.transactionSpacer);

                await Dashboard.ownerAssigned();

                browser.sleep(Dashboard.transactionSpacer);

                await Dashboard.delivered();

                expect(await Dashboard.getOrderDetails()).toEqual({
                    trim: 'Standard',
                    interior: 'Rotor Grey',
                    colour: 'Inferno Red',
                    extras: ['Extended Warranty', 'Tinted Windows']
                });
            });
        }
    });
});