import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-designer',
  templateUrl: 'designer.html'
})
export class DesignerPage {
  cars: Object[];

  constructor(public navController: NavController) {
    this.cars = [{
      name: 'Nebula',
      image: 'bmw_2.png',
      zoom: 'cover'
    }, {
      name: 'Nova',
      image: 'bmw_1.jpeg',
      zoom: 'cover'
    }, {
      name: 'Thanos',
      image: 'bmw_3.jpeg',
      zoom: 'cover'
    }]
  }

}
