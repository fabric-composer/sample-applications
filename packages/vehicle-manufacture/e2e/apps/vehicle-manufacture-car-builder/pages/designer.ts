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

import { element, by, browser } from 'protractor';

import { Login } from './login';
import { Builder } from './builder';

import { OperationsHelper } from '../../../utils/operations-helper';
import { VisibilityHelper } from '../../../utils/visibility-helper';

export class Designer extends VisibilityHelper {
    static visibilityMarker = 'page-designer';

    static async openPage() {
        if (Login.isVisible()) {
            await OperationsHelper.click(element(by.css('#buildCar')));
            await this.waitToAppear();
        } else {
            throw new Error('You can only open designer from login page')
        }
    }

    static async getVisibleSlide() {
        const leftSlide = await element.all(by.css('.swiper-slide')).get(0).isDisplayed();
        const rightSlide = await element.all(by.css('.swiper-slide')).get(2).isDisplayed();

        if (leftSlide && rightSlide) {
            return 'centre';
        } else if (leftSlide) {
            return 'left';
        } else {
            return 'right';
        }
    }

    static async swipe(direction: string = 'left') {
        if (direction !== 'left' && direction !== 'right') {
            throw new Error('Direction invalid. Must be "left" or "right".');
        }

        let x = 0;
        if (direction === 'left') {
            x = 100;
        } else if (direction === 'right') {
            x = -100;
        }

        await browser.actions()
            .mouseDown(element(by.css('.swiper-container')))
            .mouseMove({x: x, y: 0}) // try different value of x
            .mouseUp()
            .perform();

        await browser.sleep(500);
    }

    static async buildCar(card) {
        await OperationsHelper.click(element.all((by.css('.build'))).get(card));
        await Builder.waitToAppear();
    }
}