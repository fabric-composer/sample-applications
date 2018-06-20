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

import { Dashboard } from '../apps/vehicle-manufacture-vda/views/dashboard';

import { Header } from '../apps/vehicle-manufacture-vda/directives/header';
import { BlockAlert } from '../apps/vehicle-manufacture-vda/directives/block-alert';
import { BlockchainView } from '../apps/vehicle-manufacture-vda/directives/blockchain-view';
import { RecentTransactions } from '../apps/vehicle-manufacture-vda/directives/recent-transactions';

import { ComposerHelper } from '../utils/composer-helper';
import { LocalStorageHelper } from '../utils/local-storage-helper';
import { TransactionGenerator } from '../utils/transaction-generator';

describe('VDA App', () => {

    let fabricTest = browser.params.fabricTest === 'true' ? true : false;

    let blocks = {
        placeOrder: {
            type: 'PlaceOrder',
            status: undefined
        },
        scheduledForManufacture: {
            type: 'UpdateOrderStatus',
            status: 'SCHEDULED_FOR_MANUFACTURE'
        },
        vinAssigned: {
            type: 'UpdateOrderStatus',
            status: 'VIN_ASSIGNED'
        },
        ownerAssigned: {
            type: 'UpdateOrderStatus',
            status: 'OWNER_ASSIGNED'
        },
        delivered: {
            type: 'UpdateOrderStatus',
            status: 'DELIVERED'
        },
    }

    let transactions = {
        placeOrder: {
            type: 'PlaceOrder',
            participant: 'Paul'
        },
        updateOrderStatus: {
            type: 'UpdateOrderStatus',
            participant: 'Arium'
        }
    }

    let expectedTransactions = [];

    let orderId = 'VDA_ORDER';
    let VIN = '1234567890';

    let startingBlockNumber = 138;
    let transactionCount = 0;

    beforeAll(() => {
        // Important angular configuration and initial step passage to reach editor
        browser.waitForAngularEnabled(false);
        browser.get(Constants.apps.vda.url);
    });

    afterAll(() => {
        browser.waitForAngularEnabled(true);
    });

    describe('Regulate vehicles', () => {

        it ('should load the regulator dashboard', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('Regulator');

            await Dashboard.waitToAppear();
            await Header.waitToAppear();
            await BlockchainView.waitToAppear();
            await BlockAlert.waitToAppear();
            await RecentTransactions.waitToAppear();
        });

        if (fabricTest) {
            it ('should ignore previous transactions created by car spec', async () => {
                await LocalStorageHelper.set("ignoreTxnsBefore", new Date());

                browser.get(Constants.apps.vda.url);

                try {
                    await BlockchainView.hasBlock()
                    fail('Block was found');
                } catch (err) {
                    expect(err.message).toMatch(/No blocks found/);
                }

                try {
                    await RecentTransactions.hasTransaction()
                    fail('Transaction was found');
                } catch (err) {
                    expect(err.message).toMatch(/No transactions found/);
                }

                expect(await Header.getNumberRegistered()).toEqual('0');
                expect(await Header.getNumberVinAssigned()).toEqual('0');
                expect(await Header.getNumberOwnerIssued()).toEqual('0');
             });

             it ('should update the screen when a place order transaction is submitted', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.placeOrder(orderId));

                expectedTransactions.push(transactions.placeOrder);

                await BlockchainView.hasBlock();
                await RecentTransactions.hasTransaction();
                await BlockAlert.hasAlert();

                expect(await BlockchainView.getBlocks()).toEqual([blocks.placeOrder])
                expect(await BlockAlert.currentAlert()).toEqual(`NEW TRANSACTION#${startingBlockNumber+transactionCount}${blocks.placeOrder.type}`);
                expect(await Header.getNumberRegistered()).toEqual('0');
                expect(await Header.getNumberVinAssigned()).toEqual('0');
                expect(await Header.getNumberOwnerIssued()).toEqual('0');
                expect(await RecentTransactions.getTransactions()).toEqual(expectedTransactions);

                transactionCount++;
            });

            it ('should update the screen when a SCHEDULED_FOR_MANUFACTURE update order status transaction is submitted', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(`#${orderId}`, 'SCHEDULED_FOR_MANUFACTURE', null));

                expectedTransactions.unshift(transactions.updateOrderStatus);

                await BlockchainView.hasBlocks(transactionCount+1);
                await RecentTransactions.hasTransactions(transactionCount+1);
                await BlockAlert.hasAlert();

                expect(await Header.getNumberRegistered()).toEqual('0');
                expect(await Header.getNumberVinAssigned()).toEqual('0');
                expect(await Header.getNumberOwnerIssued()).toEqual('0');
                expect(await BlockchainView.getBlocks()).toEqual([blocks.placeOrder, blocks.scheduledForManufacture]);
                expect(await BlockAlert.currentAlert()).toEqual(`NEW TRANSACTION#${startingBlockNumber+transactionCount}${blocks.scheduledForManufacture.type}`);
                expect(await RecentTransactions.getTransactions()).toEqual(expectedTransactions);

                transactionCount++;
            });

            it ('should update the screen when a VIN_ASSIGNED update order status transaction is submitted', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(`#${orderId}`, 'VIN_ASSIGNED', VIN));

                expectedTransactions.unshift(transactions.updateOrderStatus);

                await BlockchainView.hasBlocks(transactionCount+1);
                await RecentTransactions.hasTransactions(transactionCount+1);
                await BlockAlert.hasAlert();

                expect(await Header.getNumberRegistered()).toEqual('1');
                expect(await Header.getNumberVinAssigned()).toEqual('1');
                expect(await Header.getNumberOwnerIssued()).toEqual('0');
                expect(await BlockchainView.getBlocks()).toEqual([blocks.placeOrder, blocks.scheduledForManufacture, blocks.vinAssigned]);
                expect(await BlockAlert.currentAlert()).toEqual(`NEW TRANSACTION#${startingBlockNumber+transactionCount}${blocks.vinAssigned.type}`);
                expect(await RecentTransactions.getTransactions()).toEqual(expectedTransactions);

                transactionCount++;
            });

            it ('should update the screen when a OWNER_ASSIGNED update order status transaction is submitted', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(`#${orderId}`, 'OWNER_ASSIGNED', VIN));

                expectedTransactions.unshift(transactions.updateOrderStatus);

                await BlockchainView.hasBlocks(transactionCount+1);
                await RecentTransactions.hasTransactions(transactionCount+1);
                await BlockAlert.hasAlert();

                expect(await Header.getNumberRegistered()).toEqual('1');
                expect(await Header.getNumberVinAssigned()).toEqual('1');
                expect(await Header.getNumberOwnerIssued()).toEqual('1');
                expect(await BlockchainView.getBlocks()).toEqual([blocks.placeOrder, blocks.scheduledForManufacture, blocks.vinAssigned, blocks.ownerAssigned]);
                expect(await BlockAlert.currentAlert()).toEqual(`NEW TRANSACTION#${startingBlockNumber+transactionCount}${blocks.ownerAssigned.type}`);
                expect(await RecentTransactions.getTransactions()).toEqual(expectedTransactions);

                transactionCount++;
            });

            it ('should update the screen when a DELIVERED update order status transaction is submitted', async () => {
                await ComposerHelper.submitTransaction(TransactionGenerator.updateOrderStatus(`#${orderId}`, 'DELIVERED', null));

                expectedTransactions.unshift(transactions.updateOrderStatus);

                await BlockchainView.hasBlocks(transactionCount+1);
                await RecentTransactions.hasTransactions(transactionCount+1);
                await BlockAlert.hasAlert();

                expect(await Header.getNumberRegistered()).toEqual('1');
                expect(await Header.getNumberVinAssigned()).toEqual('1');
                expect(await Header.getNumberOwnerIssued()).toEqual('1');
                expect(await BlockchainView.getBlocks()).toEqual([blocks.placeOrder, blocks.scheduledForManufacture, blocks.vinAssigned, blocks.ownerAssigned, blocks.delivered]);
                expect(await BlockAlert.currentAlert()).toEqual(`NEW TRANSACTION#${startingBlockNumber+transactionCount}${blocks.delivered.type}`);
                expect(await RecentTransactions.getTransactions()).toEqual(expectedTransactions);

                transactionCount++;
            });
        }
    });
});