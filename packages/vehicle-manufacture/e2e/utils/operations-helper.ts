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
import { ExpectedConditions, ElementFinder } from 'protractor';

import { Constants } from '../constants';

export class OperationsHelper {

  // Perform a 'safe' click action on an element
  static click(elm: ElementFinder) {
    return browser.wait(ExpectedConditions.presenceOf(elm), Constants.longWait)
    .then(() => {
        return browser.wait(ExpectedConditions.visibilityOf(elm), Constants.longWait);
    })
    .then(() => {
        return browser.executeScript('arguments[0].scrollIntoView();', elm);
    })
    .then(() => {
        return browser.wait(ExpectedConditions.elementToBeClickable(elm), Constants.longWait);
    })
    .then(() => {
        return elm.click();
    });
  }

  // Retrieve text from an element
  static retrieveTextFromElement(elm: ElementFinder) {
      browser.wait(ExpectedConditions.presenceOf(elm), Constants.longWait);
      browser.wait(ExpectedConditions.visibilityOf(elm), Constants.longWait);
      return browser.wait(() => {
        return elm.getText();
      });
  }

  // Retrieve value from an input element
  static retrieveValueFromElement(elm: ElementFinder) {
    browser.wait(ExpectedConditions.presenceOf(elm), Constants.longWait);
    browser.wait(ExpectedConditions.visibilityOf(elm), Constants.longWait);
    return browser.wait(() => {
      return elm.getAttribute('value');
    });
}

  // Retrieve an array of all matching elements
  static retrieveMatchingElementsByCSS(type: string, subset: string, minCount) {
    browser.wait(this.elementsPresent(element(by.css(type)).all(by.css(subset)), minCount), Constants.longWait);
    return element(by.css(type)).all(by.css(subset));
  }

  static retrieveMatchingElementsByCSSFromParentByID(parent: string, child: string, minCount) {
    browser.wait(this.elementsPresent(element(by.id(parent)).all(by.css(child)), minCount), Constants.longWait);
    return element(by.id(parent)).all(by.css(child));
  }

  // Custom ExpectedCondition to be used to ensure that ArrayFinder count is non-zero
  static elementsPresent(elementArrayFinder, minCount) {
    let hasCount = (() => {
      return elementArrayFinder.count()
      .then((count) => {
        return count >= minCount;
      });
    });
    return ExpectedConditions.and(ExpectedConditions.presenceOf(elementArrayFinder), hasCount);
  };
}
