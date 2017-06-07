import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public name;

  constructor(private navController: NavController) {
    this.name = 'Anna';
  }

  go() {
    this.navController.setRoot(LoginPage);
  }
}
