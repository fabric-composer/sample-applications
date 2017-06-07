import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { StatusPage } from './status';

@NgModule({
  declarations: [
    StatusPage,
  ],
  imports: [
    IonicModule.forRoot(StatusPage),
  ],
  exports: [
    StatusPage
  ]
})
export class StatusPageModule {}
