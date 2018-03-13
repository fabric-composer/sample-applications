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

'use strict'
var chalk = require('chalk');
var fs  = require('fs');
var path= require('path');
var pretty = require('prettyjson');


console.log(chalk.blue.bold('Hyperledger Composer Sample applications available in this repository:\n'));

let apps = fs.readdirSync('./packages/');
apps.forEach(function(entry) {
	var possiblePackage = path.resolve('./packages/',entry,'package.json');
	
	if (fs.existsSync(possiblePackage)){
	    var packagejson = require(possiblePackage);

	    var sampleapp = { 'App Directory': './packages/'+entry,
	                      'App Name':packagejson.name,
	                      'App Description':packagejson.description,
	                      'To run this app':packagejson.bin }



	    console.log(pretty.render(sampleapp,{
	        keysColor: 'blue',
	        dashColor: 'blue',
	        stringColor: 'white'
	    }));
	    console.log('\n');
	}
});
