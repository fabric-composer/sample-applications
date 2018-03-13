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
