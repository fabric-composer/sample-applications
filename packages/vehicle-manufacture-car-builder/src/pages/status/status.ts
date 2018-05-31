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
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../providers/config/config';

/**
 * Generated class for the StatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {
  car: Object;
  orderId: String;
  stage: Array<String>;
  relativeDate: any;
  config: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private configProvider: ConfigProvider) {
    this.car = navParams.get('car');
    this.stage = [Date.now() + ''];
    this.orderId = navParams.get('orderId');

    this.relativeDate = function(input, start) {
      if (input) {
        input = Date.parse(input);
        var diff = input - start;
        diff = diff / 1000
        diff = Math.round(diff);

        var result = '+' + diff +  ' secs'

        return result;
      }
    };

    let statuses = ['PLACED', 'SCHEDULED_FOR_MANUFACTURE', 'VIN_ASSIGNED', 'OWNER_ASSIGNED', 'DELIVERED'];

    var websocket;

    var openWebSocket = () => {
      var webSocketURL = this.config.restServer.webSocketURL;

      console.log('connecting websocket', webSocketURL);
      websocket = new WebSocket(webSocketURL);

      websocket.onopen = function () {
        console.log('websocket open!');
      };

      websocket.onclose = function() {
        console.log('closed');
        openWebSocket();
      }

      websocket.onmessage = (event) => {
        var status = JSON.parse(event.data);
        if (status.$class === 'org.acme.vehicle_network.UpdateOrderStatusEvent') {
          let i = statuses.indexOf(status.orderStatus);
          this.stage[i] = this.relativeDate(status.timestamp, this.stage[0]);
        }
      };
    }

    this.configProvider.ready.subscribe((ready) => {
      if (ready) {
        this.config = this.configProvider.getConfig();
        openWebSocket();
      }
    });
  }
}
