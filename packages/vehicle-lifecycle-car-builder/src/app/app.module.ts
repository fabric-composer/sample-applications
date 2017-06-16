import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DesignerPage } from '../pages/designer/designer';
import { BuilderPage } from '../pages/builder/builder';
import { StatusPage } from '../pages/status/status';
import { CarSlideComponent } from '../components/car-slide/car-slide';
import { HeaderComponent } from '../components/header/header';

// This needs to be changed if interacting with Ionic services - https://docs.ionic.io/setup.html
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': ''
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DesignerPage,
    BuilderPage,
    StatusPage,
    CarSlideComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DesignerPage,
    BuilderPage,
    StatusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
