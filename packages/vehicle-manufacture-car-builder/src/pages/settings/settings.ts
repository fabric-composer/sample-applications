/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Keyboard } from '@ionic-native/keyboard';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config'

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private storedConfig;
  private ready = false;

  constructor(public navController: NavController, public navParams: NavParams, private keyboard: Keyboard, private configProvider: ConfigProvider) {
    this.configProvider.ready.subscribe((ready) => {
      if (ready) {
        this.ready = true;
        this.storedConfig = this.configProvider.getConfig();
      }
    });
  }

  back() {
    this.navController.pop();
  }

  update() {
    this.configProvider.setConfig(this.storedConfig);
    this.keyboard.close();
    this.back();
  }

}
