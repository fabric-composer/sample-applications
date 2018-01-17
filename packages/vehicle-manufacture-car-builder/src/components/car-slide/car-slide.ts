import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BuilderPage } from '../../pages/builder/builder';

/**
 * Generated class for the CarSlideComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'car-slide',
  templateUrl: 'car-slide.html'
})
export class CarSlideComponent {
  @Input() car: Object;

  constructor(private navController: NavController) {
  }

  build(car) {
    this.navController.push(BuilderPage, {
      car: car
    });
  }
}
