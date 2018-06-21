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

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ReplaySubject } from 'rxjs';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConfigProvider {

  private config = {
    restServer: {
        webSocketURL: null,
        httpURL: null
    }
  };

  public ready: ReplaySubject<boolean> = new  ReplaySubject(1);

  constructor(public http: Http) {
    this.loadConfig()
    .then((config) => {
      this.config = config;
      this.ready.next(true);
    })
    .catch((err) => {
      console.log('ERROR GETTING CONFIG USING DEFAULT', err.message);
      this.config = {
        restServer: {
            webSocketURL: "ws://localhost:3000",
            httpURL: "http://localhost:3000/api"
        }
      }    
      this.ready.next(true);  
    })
  }

  getConfig() {
    if(localStorage.getItem('config')){
      return JSON.parse(localStorage.getItem('config'));
    }

    return this.config;
  }

  setConfig(newConfig) {
    localStorage.setItem('config', JSON.stringify(newConfig));
  }

  resetConfig() {
    localStorage.removeItem('config');
  }

  loadConfig(): Promise<any> {
    // Load the config data.
    return this.http.get('/assets/config.json')
    .map((res: Response) => res.json())
    .toPromise();
  }
}