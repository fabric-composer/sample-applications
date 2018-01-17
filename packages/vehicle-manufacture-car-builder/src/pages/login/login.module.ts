import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicModule.forRoot(LoginPage),
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}
