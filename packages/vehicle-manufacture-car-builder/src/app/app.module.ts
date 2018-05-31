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
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { DesignerPage } from '../pages/designer/designer';
import { BuilderPage } from '../pages/builder/builder';
import { StatusPage } from '../pages/status/status';
import { CarSlideComponent } from '../components/car-slide/car-slide';
import { HeaderComponent } from '../components/header/header';
import { SettingsPage } from '../pages/settings/settings';
import { ConfigProvider } from '../providers/config/config';

// This needs to be changed if interacting with Ionic services - https://docs.ionic.io/setup.html
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': ''
  }
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SettingsPage,
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
    LoginPage,
    SettingsPage,
    DesignerPage,
    BuilderPage,
    StatusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider
  ]
})
export class AppModule {}
