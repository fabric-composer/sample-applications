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

import path = require('path');
import * as fs from 'fs';

export class Constants {
    static readonly tinyWait = 1000;
    static readonly shortWait = 5000;
    static readonly longWait = 10000;

    static readonly restPort = 3001;

    static readonly appConfig = {
        restServer: {
            httpURL: 'http://localhost:3001/api',
            webSocketURL: 'ws://localhost:3001'
        }
    }

    static readonly appTitle = 'Arium Configurator';

    static readonly scriptsDir = path.join(__dirname, 'scripts');
    static readonly tempDir = path.join(__dirname, 'tmp');
    static readonly nodeModulesDir = path.join(__dirname, '../node_modules');

    static readonly fabricBaseDir = path.join(__dirname, 'fabric');
    static readonly fabricConfigDir = path.join(Constants.fabricBaseDir, 'hlfv1');
    static readonly peerAdminCardName = 'TestPeerAdmin.card';

    static readonly networkNamespace = 'org.acme.vehicle_network';

    static readonly apps = {
        carBuilder: {
            url: 'http://127.0.0.1:8100',
            dir: path.join(__dirname, '../../vehicle-manufacture-car-builder'),
            config: JSON.parse(fs.readFileSync(path.join(__dirname, '../../vehicle-manufacture-car-builder/config/default.json'), 'utf8'))
        },
        manufacturer: {
            url: 'http://127.0.0.1:6002',
            dir: path.join(__dirname, '../../vehicle-manufacture-manufacturing'),
            config: JSON.parse(fs.readFileSync(path.join(__dirname, '../../vehicle-manufacture-manufacturing/config/default.json'), 'utf8'))
        },
        vda: {
            url: 'http://127.0.0.1:6001',
            dir: path.join(__dirname, '../../vehicle-manufacture-vda'),
            config: JSON.parse(fs.readFileSync(path.join(__dirname, '../../vehicle-manufacture-vda/config/default.json'), 'utf8'))
        }
    }
}