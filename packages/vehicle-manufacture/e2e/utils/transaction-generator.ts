/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Constants } from '../constants';

export class TransactionGenerator {
    static placeOrder(orderId) {
        return `{
            "$class": "${Constants.networkNamespace}.PlaceOrder",
            "orderId": "${orderId}",
            "vehicleDetails": {
                "$class": "${Constants.networkNamespace}.VehicleDetails",
                "make": "resource:${Constants.networkNamespace}.Manufacturer#Arium",
                "modelType": "Nova",
                "colour": "Inferno Red"
            },
            "options": {
                "$class": "${Constants.networkNamespace}.Options",
                "trim": "standard",
                "interior": "Rotor Grey",
                "extras": ["Extended Warranty", "Tinted Windows"]
            },
            "orderer": "resource:${Constants.networkNamespace}.Person#paul"
        }`
    }

    static updateOrderStatus(orderId, status, vin) {
        let tx = `{
            "$class": "${Constants.networkNamespace}.UpdateOrderStatus",
            "orderStatus": "${status}",
            "order": "resource:${Constants.networkNamespace}.Order${orderId}"`
        if (vin) {
            tx += `,"vin": "${vin}"`
        }
        return `${tx}}`
    }
}