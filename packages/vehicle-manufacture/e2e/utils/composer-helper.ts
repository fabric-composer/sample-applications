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

import { CodeRunner } from './code-runner';
import { Constants} from '../constants';

import fs = require('fs');
import path = require('path');
import { spawn } from 'child_process';

export class ComposerHelper {

    static composerCli = `node ${path.join(Constants.nodeModulesDir, 'composer-cli/cli.js')}`;
    static composerRestServerPath = path.join(Constants.nodeModulesDir, 'composer-rest-server/cli.js');
    static childServer;

    static network = {
        name: 'vehicle-manufacture-network',
        version: JSON.parse(fs.readFileSync(path.join(Constants.nodeModulesDir, 'vehicle-manufacture-network/package.json'), 'utf-8')).version
    }

    static async createPeerAdmin() {

        const cp = path.join(Constants.fabricConfigDir, 'profiles/basic-connection-org1.json');
        const pub = path.join(Constants.fabricConfigDir, 'crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem');
        const priv = path.join(Constants.fabricConfigDir, 'crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/key.pem');
        const outputFile = path.join(Constants.tempDir, Constants.peerAdminCardName);
        // check we have the certificates
        if (!fs.existsSync(pub)) {
            throw new Error('Public Certificate not found at location: ' + pub);
        }

        if (!fs.existsSync(priv)) {
            throw new Error('Private certificate not found at location: ' + priv);
        }

        // check we have the connection proile
        if (!fs.existsSync(cp)) {
            throw new Error('Connection profile not found at location: ' + cp);
        }

        await CodeRunner.runCode(`${this.composerCli} card create -p ${cp} -u ${Constants.peerAdminCardName} -r PeerAdmin -r ChannelAdmin -f ${outputFile} -c ${pub} -k ${priv}`);
        return CodeRunner.runCode(`${this.composerCli} card import -f ${outputFile} -c ${Constants.peerAdminCardName}@Testing`);
    }

    static async deployNetwork() {
        const bnaFile = path.join(__dirname, `../../node_modules/vehicle-manufacture-network/dist/${this.network.name}.bna`);
        const card = path.join(Constants.tempDir, 'networkadmin') + '.card';

        await CodeRunner.runCode(`${this.composerCli} network install -c ${Constants.peerAdminCardName}@Testing -a ${bnaFile}`);
        await CodeRunner.runCode(`${this.composerCli} network start -c ${Constants.peerAdminCardName}@Testing -A admin -S adminpw -n ${this.network.name} -V ${this.network.version} -f ${card}`);
        await CodeRunner.runCode(`${this.composerCli} card import -f ${card} -c admin@${this.network.name}`);
        return this.submitTransaction('{"$class": "org.acme.vehicle_network.SetupDemo"}')
    }

    static submitTransaction(data) {
        return CodeRunner.runCode(`${this.composerCli} transaction submit -c admin@${this.network.name} -d '${data}'`)
    }

    static startRestServer() {
        return new Promise((resolve, reject) => {
            this.childServer = spawn('node', [`${this.composerRestServerPath}`, `-c`, `admin@${this.network.name}`, `-n`, `never`, `-p`, Constants.restPort.toString()]);
            this.childServer.stdout.on('data', (data) => {
                if (data.toString().includes(`Web server listening at`)) {
                    resolve();
                }
            });

            this.childServer.stderr.on('data', (data) => {
                this.childServer.kill();
                this.childServer = null;
                reject(data.toString());
            });
        });
    }

    static stopRestServer() {
        if (this.childServer) {
            return this.childServer.kill();
        } else {
            throw new Error('You must start the rest server to stop it');
        }
    }
}