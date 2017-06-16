import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CarSlideComponent } from './car-slide';

@NgModule({
  declarations: [
    CarSlideComponent,
  ],
  imports: [
    IonicModule.forRoot(CarSlideComponent),
  ],
  exports: [
    CarSlideComponent
  ]
})
export class CarSlideComponentModule {}
