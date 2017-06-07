import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DesignerPage } from '../designer/designer';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  designerPage: DesignerPage;

  constructor(public navController: NavController, public navParams: NavParams) {
  }

  login() {
    this.navController.push(DesignerPage);
  }

}
