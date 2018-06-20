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

import { exec } from 'child_process';
import stripAnsi = require('strip-ansi');

export class CodeRunner {

    static runCode(cmd): Promise<any> {
        if (typeof cmd !== 'string') {
            return Promise.reject('Command passed to function was not a string');
        } else {
            console.log('Running command: ', cmd);

            let stdout;
            let stderr;

            return new Promise((resolve, reject) => {
                let childCliProcess = exec(cmd);

                childCliProcess.stdout.on('data', (data) => {
                    // do not log return characters or 'green dot progress'
                    let msg = data.toString();
                    msg.replace(/\n$/, '');
                    msg = msg.replace(/\x1b\[32m.\x1b\[0m/, '');
                    if (msg.length) {
                        console.log(msg);
                    }
                });

                childCliProcess.stderr.on('data', (data) => {
                    console.log('stdErr: ' + data);
                });

                childCliProcess.on('error', (error) => {
                    error = stripAnsi(error);
                    console.log('ERR', error);
                    reject({ error: error, stdout: stdout, stderr: stderr });
                });

                childCliProcess.on('close', (code) => {
                    if (code && code !== 0 ) {
                        reject({ stdout: stdout, stderr: stderr, code: code });
                    } else {
                        resolve(code);
                    }
                });
            });
        }
    }
}
