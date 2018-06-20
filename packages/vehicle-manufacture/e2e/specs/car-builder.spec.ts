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

import { Login } from '../apps/vehicle-manufacture-car-builder/pages/login';
import { Settings } from '../apps/vehicle-manufacture-car-builder/pages/settings';
import { Designer } from '../apps/vehicle-manufacture-car-builder/pages/designer';
import { Builder } from '../apps/vehicle-manufacture-car-builder/pages/builder'; 
import { Status } from '../apps/vehicle-manufacture-car-builder/pages/status';
import { Header } from '../apps/vehicle-manufacture-car-builder/components/header';

import { LocalStorageHelper } from '../utils/local-storage-helper';
import { ComposerHelper } from '../utils/composer-helper';
import { TransactionGenerator } from '../utils/transaction-generator';

describe('Car Builder App', () => {

    let fabricTest = browser.params.fabricTest === 'true' ? true : false;
    let VIN = '123457890';

    beforeAll(() => {
        // Important angular configuration and initial step passage to reach editor
        browser.waitForAngularEnabled(false);
        browser.get(Constants.apps.carBuilder.url);
    });

    afterAll(() => {
        browser.waitForAngularEnabled(true);
    });

    describe('Place Order', () => {
        it('should load the app', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('Car Builder');

            await Login.waitToAppear();
        })

        if (fabricTest) {
            it('should be set to the default URLs', async () => {
                await Settings.openPage();

                const config = Settings.getConfig();
                const defaultConfig = Constants.apps.carBuilder.config;
    
                expect(config).toEqual(defaultConfig);
            });

            it('should be able to set the rest URL', async () => {
                browser.sleep(Constants.tinyWait);

                await Settings.setConfig(Constants.appConfig.restServer.httpURL, Constants.appConfig.restServer.webSocketURL);
                
                let storageConfig = JSON.parse(await LocalStorageHelper.getValue('config'));
                expect(storageConfig).toEqual(Constants.appConfig);
            });
        }

        it('should let the user choose a car type', async () => {
            await Designer.openPage();

            expect(await Header.isVisible()).toEqual(true);
            expect(await Header.getContent()).toEqual(Constants.appTitle);

            expect(await Designer.getVisibleSlide()).toEqual('centre');

            await Designer.swipe('left');
            expect(await Designer.getVisibleSlide()).toEqual('left');

            await Designer.swipe('right');
            expect(await Designer.getVisibleSlide()).toEqual('centre');
            
            await Designer.swipe('right');
            expect(await Designer.getVisibleSlide()).toEqual('right');

            await Designer.buildCar(2);
            expect(await Builder.getCarType()).toEqual('Arium Thanos');
            expect(await Builder.canPlaceOrder()).toEqual(false);
        });

        it ('should let the user configure the car', async () => {
            browser.sleep(Constants.tinyWait);

            await Builder.setOption('trim', 'Executive');
            expect(await Builder.getOption('trim')).toEqual('Executive');
            expect(await Builder.canPlaceOrder()).toEqual(false);

            await Builder.setOption('colour', 'Alpine Green');
            expect(await Builder.getOption('colour')).toEqual('Alpine Green');
            expect(await Builder.canPlaceOrder()).toEqual(false);

            await Builder.setOption('interior', 'Red Rum');
            expect(await Builder.getOption('interior')).toEqual('Red Rum');
            expect(await Builder.canPlaceOrder()).toEqual(true);

            await Builder.setOption('extras', 'Extended Warranty');
            expect(await Builder.getOption('extras')).toEqual('Extended Warranty');
            expect(await Builder.canPlaceOrder()).toEqual(true);

            await Builder.setOption('extras', 'Tinted Windows');
            expect(await Builder.getOption('extras')).toEqual('2 Selected');
            expect(await Builder.canPlaceOrder()).toEqual(true);
        });

        if (fabricTest) {
            it ('should allow the user to submit their purchase', async () => {
                await Builder.placeOrder();

                await Status.waitToAppear();

                browser.wait(async () => {
                    try {
                        return await Status.stageComplete('order');
                    } catch (err) {
                        return false;
                    }
                }, Constants.shortWait);

                expect((await Status.stageComplete('manufacture'))).toEqual(false);
                expect((await Status.stageComplete('vin'))).toEqual(false);
                expect((await Status.stageComplete('owner'))).toEqual(false);
                expect((await Status.stageComplete('delivered'))).toEqual(false);
            });

            it ('should update the user when their purchase is manufactured', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(await Status.getOrderId(), 'SCHEDULED_FOR_MANUFACTURE', null))

                browser.wait(async () => {
                    try {
                        return await Status.stageComplete('manufacture');
                    } catch (err) {
                        return false;
                    }
                }, Constants.shortWait);

                expect((await Status.stageComplete('order'))).toEqual(true);
                expect((await Status.stageComplete('vin'))).toEqual(false);
                expect((await Status.stageComplete('owner'))).toEqual(false);
                expect((await Status.stageComplete('delivered'))).toEqual(false);
            });

            it ('should update the user when their purchase has the vin assigned', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(await Status.getOrderId(), 'VIN_ASSIGNED', VIN))

                browser.wait(async () => {
                    try {
                        return await Status.stageComplete('vin');
                    } catch (err) {
                        return false;
                    }
                }, Constants.shortWait);

                expect((await Status.stageComplete('order'))).toEqual(true);
                expect((await Status.stageComplete('manufacture'))).toEqual(true);
                expect((await Status.stageComplete('owner'))).toEqual(false);
                expect((await Status.stageComplete('delivered'))).toEqual(false);
            });

            it ('should update the user when their purchase has the owner assigned', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(await Status.getOrderId(), 'OWNER_ASSIGNED', VIN))

                browser.wait(async () => {
                    try {
                        return await Status.stageComplete('owner');
                    } catch (err) {
                        return false;
                    }
                }, Constants.shortWait);

                expect((await Status.stageComplete('order'))).toEqual(true);
                expect((await Status.stageComplete('manufacture'))).toEqual(true);
                expect((await Status.stageComplete('vin'))).toEqual(true);
                expect((await Status.stageComplete('delivered'))).toEqual(false);
            });

            it ('should update the user when their purchase has been delivered', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(await Status.getOrderId(), 'DELIVERED', null))

                browser.wait(async () => {
                    try {
                        return await Status.stageComplete('delivered');
                    } catch (err) {
                        return false;
                    }
                }, Constants.shortWait);

                expect((await Status.stageComplete('order'))).toEqual(true);
                expect((await Status.stageComplete('manufacture'))).toEqual(true);
                expect((await Status.stageComplete('vin'))).toEqual(true);
                expect((await Status.stageComplete('owner'))).toEqual(true);
            });

        } else {
            it ('should error if the REST server is not running and the user places an order', async () => {
                await Builder.placeOrder();
                expect(await Builder.getPlaceOrderText()).toEqual('AN ERROR OCCURRED');
            });
        }
    });
});