#!/usr/bin/env node
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

'use strict';

const LandRegistry = require('./../../landRegistry.js');
const winston = require('winston');
const LOG = winston.loggers.get('application');

exports.command = 'submit';
exports.desc = 'Updates a fixed title in the regsitry';
exports.builder = {};
exports.handler = async function (argv) {

    try {
        await LandRegistry.submitCmd(argv);
        LOG.info('Command completed successfully.');
        process.exit(0);
    } catch(error) {
        LOG.error(error+ '\nCommand failed.');
        process.exit(1);
    }
};
