import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { BuilderPage } from './builder';

@NgModule({
  declarations: [
    BuilderPage,
  ],
  imports: [
    IonicModule.forRoot(BuilderPage),
  ],
  exports: [
    BuilderPage
  ]
})
export class BuilderPageModule {}
