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
