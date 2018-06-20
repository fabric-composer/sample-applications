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
class Config {
    constructor() {
        this.restServer = {};
        this.restServer.webSocketURL = "ws://localhost:3000";
        this.restServer.httpURL = "http://localhost:3000/api";
        this.restServer.explorer = "http://localhost:3000/explorer";

        this.playground = {};
        this.playground.name = "Hyperledger Composer";
        this.playground.docURL = "https://hyperledger.github.io/composer/latest/";
        this.playground.deployedURL = "http://localhost:8080";

        if (process.env.REACT_APP_REST_SERVER_CONFIG) {
            try {
                let restServerConfig = JSON.parse(process.env.REACT_APP_REST_SERVER_CONFIG);
                if (restServerConfig.webSocketURL) {
                    this.restServer.webSocketURL = restServerConfig.webSocketURL;
                } 
                if (restServerConfig.httpURL) {
                    this.restServer.httpURL = restServerConfig.httpURL;
                }
                if (restServerConfig.explorer) {
                    this.restServer.explorer = restServerConfig.explorer;
                }
            } catch (err) {
                console.error('CONFIG ERROR', err);
            }
        }

        if (process.env.REACT_APP_PLAYGROUND_CONFIG) {
            try {
                let playgroundConfig = JSON.parse(process.env.REACT_APP_PLAYGROUND_CONFIG);
                if (playgroundConfig.name) {
                    this.playground.name = playgroundConfig.name;
                } 
                if (playgroundConfig.docURL) {
                    this.playground.docURL = playgroundConfig.docURL;
                }
                if (playgroundConfig.deployedURL) {
                    this.playground.deployedURL = playgroundConfig.deployedURL;
                }
            } catch (err) {
                console.error('CONFIG ERROR', err);
            }
        }
    }
}

export default Config;
