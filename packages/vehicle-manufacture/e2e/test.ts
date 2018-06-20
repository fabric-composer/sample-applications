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

import { spawn } from 'child_process';

import { CodeRunner } from './utils/code-runner';
import { FabricHelper } from './utils/fabric-helper';
import { ComposerHelper } from './utils/composer-helper';

import { Constants } from './constants';

import * as path from 'path';

async function runE2e() {
    const args = process.argv;

    let code;

    if (args.indexOf('--fabric') !== -1 || args.indexOf('-f') !== -1) {
        code = await runFabric();
    } else {
        code = await runTests(false);
    }
    
    process.exit(code);
}

async function runFabric() {
    let code;
    try {
        await FabricHelper.start();
        await ComposerHelper.createPeerAdmin();
        await ComposerHelper.deployNetwork();
        await ComposerHelper.startRestServer();
        code = await runTests(true);
    } catch (err) {
        console.log('RUNNING FABRIC TESTS FAILED', err);
        // tests failed but still want to clean up fabric so do nothing
    }
    await ComposerHelper.stopRestServer();
    await FabricHelper.stop();
    return code;
}

async function runTests(fabric) {
    const carBuilderConf = Constants.apps.carBuilder.config;

    let builderEnv = Object.create(process.env);
    builderEnv.REST_SERVER_CONFIG = JSON.stringify(carBuilderConf.restServer);

    let otherEnv = Object.create(process.env);
    otherEnv.REST_SERVER_CONFIG = JSON.stringify({
        "webSocketURL": "ws://localhost:3001",
        "httpURL": "http://localhost:3001/api"
    })

    let carBuilderServer = spawn('node', [path.join(Constants.apps.carBuilder.dir, 'app.js')], {env: builderEnv});
    let manufacturerServer = spawn('node', [path.join(Constants.apps.manufacturer.dir, 'server/app.js')], {env: otherEnv});
    let vdaServer = spawn('node', [path.join(Constants.apps.vda.dir, 'server/app.js')], {env: otherEnv});

    let code
    try {
        code = await CodeRunner.runCode(`webdriver-manager update --gecko false && protractor protractor.conf.js --params.fabricTest=${fabric}`);
    } catch (err) {
        code = err.code;
    }
    console.log('Protractor return code: ', code);
    if (code !== 0) {
        code = 1;
    }
    carBuilderServer.kill();
    manufacturerServer.kill();
    return code;
}

runE2e();