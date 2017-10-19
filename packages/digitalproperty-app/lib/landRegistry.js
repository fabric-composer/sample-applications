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

// This is a simple sample that will demonstrate how to use the
// API connecting to a HyperLedger Blockchain Fabric
//
// The scenario here is using a simple model of a participant of 'Student'
// and a 'Test' and 'Result'  assets.

'use strict';

const inquirer = require('inquirer');
const path = require('path');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
let config = require('config').get('digitalproperty-app');
// const mqlight = require('mqlight');
const prettyjson = require('prettyjson');

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = config.get('participantId');
let participantPwd = config.get('participantPwd');
const LOG = winston.loggers.get('application');

const util = require('Util');

/** Class for the land registry*/
class LandRegistry {

    /**
     * Need to have the mapping from bizNetwork name to the URLs to connect to.
     * bizNetwork nawme will be able to be used by Composer to get the suitable model files.
     *
     */
    constructor() {

        this.bizNetworkConnection = new BusinessNetworkConnection();
        this.CONNECTION_PROFILE_NAME = config.get('connectionProfile');
        this.businessNetworkIdentifier = config.get('businessNetworkIdentifier');
    }

    /** @description Initalizes the LandRegsitry by making a connection to the Composer runtime
     * @return {Promise} A promise whose fullfillment means the initialization has completed
     */
    init() {

        return this.bizNetworkConnection.connect(this.CONNECTION_PROFILE_NAME, this.businessNetworkIdentifier, participantId, participantPwd)
            .then((result) => {
                this.businessNetworkDefinition = result;
                LOG.info('LandRegistry:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
            })
            // and catch any exceptions that are triggered
            .catch(function (error) {
                throw error;
            });

    }

    /** Listen for the sale transaction events

     */
    listen() {
        this.bizNetworkConnection.on('event', (evt) => {
            console.log(chalk.blue.bold('New Event'));
            console.log(evt);

            let options = {
                properties: { key: 'value' }
            };

        });
    }

    /** Updates a fixes asset for selling..
    @return {Promise} resolved when this update has compelted
    */
    updateForSale(args) {



        let salesquestions = [

            {
                name: 'PID',
                type: 'input',
                message: 'Enter your PID:',
                validate: function (value) {
                    if (value.length <= 10) {
                        return true;
                    } else {
                        return 'Please enter your PID.';
                    }
                }
            },

            {
                name: 'LID',
                type: 'input',
                message: 'Please enter your LID :',
                validate: function (value) {
                    if (value.length <= 4) {
                        return true;
                    } else {
                        return 'Please enter your LID.';
                    }
                }
            },
        ]
        return inquirer.prompt(salesquestions)


    }


    updateForSales(composer) {
        const METHOD = 'updateForSale';


        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
            .then((registry) => {

                LOG.info(METHOD, 'Getting assest from the registry.');
                return registry.get(composer.LID);

            }).then(() => {
                return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person')
            }).then((registry) => {
                LOG.info(METHOD, 'Getting assest from the registry.');
                return registry.get(composer.PID);
            })
            .then((result) => {

                let factory = this.businessNetworkDefinition.getFactory();
                let transaction = factory.newTransaction('net.biz.digitalPropertyNetwork', 'RegisterPropertyForSale');
                transaction.title = factory.newRelationship('net.biz.digitalPropertyNetwork', 'LandTitle', composer.LID);
                transaction.seller = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', composer.PID);

                LOG.info(METHOD, 'Submitting transaction');

                return this.bizNetworkConnection.submitTransaction(transaction);
            }) // and catch any exceptions that are triggered
            .catch(function (error) {
                LOG.error('LandRegsitry:updateForSale', error);
                throw error;
            });
    }

    /** bootstrap into the resgitry a few example land titles
      * @return {Promise} resolved when the assests have been created
  
    */
    _bootstrapTitles() {
        LOG.info('LandRegistry:_bootstrapTitles', 'getting asset registry for "net.biz.digitalPropertyNetwork.LandTitle"');
        let owner;
        LOG.info('about to get asset registry');
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle') // how do I know what this name is?

            .then((result) => {
                // got the assest registry for land titles
                LOG.info('LandRegistry:_bootstrapTitles', 'got asset registry');
                this.titlesRegistry = result;
            }).then(() => {
                LOG.info('LandRegistry:_bootstrapTitles', 'getting factory and adding assets');
                let factory = this.businessNetworkDefinition.getFactory();

                LOG.info('LandRegistry:_bootstrapTitles', 'Creating a person');
                owner = factory.newResource('net.biz.digitalPropertyNetwork', 'Person', 'PID:1234567890');
                owner.firstName = 'Fred';
                owner.lastName = 'Bloggs';

                /** Create a new relationship for the owner */
                let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'PID:1234567890');

                LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#1');
                let landTitle1 = factory.newResource('net.biz.digitalPropertyNetwork', 'LandTitle', 'LID:1148');
                landTitle1.owner = ownerRelation;
                landTitle1.information = 'A nice house in the country';

                LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#2');
                let landTitle2 = factory.newResource('net.biz.digitalPropertyNetwork', 'LandTitle', 'LID:6789');
                landTitle2.owner = ownerRelation;
                landTitle2.information = 'A small flat in the city';

                LOG.info('LandRegistry:_bootstrapTitles', 'Adding these to the registry');
                return this.titlesRegistry.addAll([landTitle1, landTitle2]);

            }).then(() => {
                return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person');
            })
            .then((personRegistry) => {
                return personRegistry.add(owner);
            }) // and catch any exceptions that are triggered
            .catch(function (error) {
                console.log(error);
                LOG.error('LandRegsitry:_bootstrapTitles', error);
                throw error;
            });

    }

    /**
     * List the land titles that are stored in the Land Title Resgitry
     * @return {Promise} resolved when fullfiled will have listed out the titles to stdout
     */
    listTitles() {
        const METHOD = 'listTitles';

        let landTitleRegistry;
        let personRegistry;

        LOG.info(METHOD, 'Getting the asset registry');
        // get the land title registry and then get all the files.
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
            .then((registry) => {
                landTitleRegistry = registry;

                return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person');
            }).then((registry) => {
                personRegistry = registry;

                LOG.info(METHOD, 'Getting all assest from the registry.');
                return landTitleRegistry.resolveAll();

            })

            .then((aResources) => {

                LOG.info(METHOD, 'Current Land Titles');
                // instantiate
                let table = new Table({
                    head: ['TitleID', 'OwnerID', 'First Name', 'Surname', 'Description', 'ForSale']
                });
                let arrayLength = aResources.length;
                for (let i = 0; i < arrayLength; i++) {

                    let tableLine = [];



                    tableLine.push(aResources[i].titleId);
                    tableLine.push(aResources[i].owner.personId);
                    tableLine.push(aResources[i].owner.firstName);
                    tableLine.push(aResources[i].owner.lastName);
                    tableLine.push(aResources[i].information);
                    tableLine.push(aResources[i].forSale ? 'Yes' : 'No');
                    table.push(tableLine);
                }

                // Put to stdout - as this is really a command line app
                return (table);
            })


            // and catch any exceptions that are triggered
            .catch(function (error) {
                console.log(error);
                /* potentially some code for generating an error specific message here */
                this.log.error(METHOD, 'uh-oh', error);
            });

    } /**
    * List the Sales Agreements that are created when a land title is submited for sale.
    * @return {Promise} resolved when fullfiled will have listed out the titles to stdout
    */
    listSales() {
        const METHOD = 'listSales';

        let salesRegistry;

        LOG.info(METHOD, 'Getting the asset registry');
        // get the land title registry and then get all the files.
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.SalesAgreement')
            .then((registry) => {
                salesRegistry = registry;


                LOG.info(METHOD, 'Getting all assest from the registry.');
                return salesRegistry.resolveAll();

            })

            .then((aResources) => {
                console.log(aResources);

                LOG.info(METHOD, 'Current Sales Agreements');
                // instantiate
                let table = new Table({
                    head: ['SaleID', 'OwnerID', 'TitleID']
                });
                let arrayLength = aResources.length;
                for (let i = 0; i < arrayLength; i++) {

                    let tableLine = [];



                    tableLine.push(aResources[i].salesId);
                    tableLine.push(aResources[i].seller.personId);
                    tableLine.push(aResources[i].title.titleId);

                    table.push(tableLine);
                }

                // Put to stdout - as this is really a command line app
                return (table);
            })


            // and catch any exceptions that are triggered
            .catch(function (error) {
                console.log(error);
                /* potentially some code for generating an error specific message here */
                this.log.error(METHOD, 'uh-oh', error);
            });

    }
    /**
    * @description - run the listtiles command
    * @param {Object} args passed from the command line
    * @return {Promise} resolved when the action is complete
    */
    static listSalesCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()
            .then(() => {
                return lr.listSales();
            })

            .then((results) => {
                LOG.info('Sales listed');
                LOG.info('\n' + results.toString());
            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }



    /**
     * @description - run the listtiles command
     * @param {Object} args passed from the command line
     * @return {Promise} resolved when the action is complete
     */
    static listCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()
            .then(() => {
                return lr.listTitles();
            })

            .then((results) => {
                LOG.info('Titles listed');
                LOG.info('\n' + results.toString());
            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }

    /**
     * @description - run the listtiles command
     * @param {Object} args passed from the command line
     * @return {Promise} resolved when the action is complete
     */
    static listen(args) {
        let lr = new LandRegistry('landRegsitryUK');
        return lr.init()
            .then(() => {

           



            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }

    /**
     * @description - run the add default assets command
     * @param {Object} args passed from the command line
     * @return {Promise} resolved when complete
     */
    static addDefaultCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()

            .then(() => {
                return lr._bootstrapTitles();
            })

            .then((results) => {
                LOG.info('Default titles added');
            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }

    /**
    * @description - run the listtiles command
    * @param {Object} args passed from the command line
    * @return {Promise} resolved when the action is complete
    */

    static addLandTitle(args) {

        let lr = new LandRegistry('landRegsitryUK');
        return lr.init()
            .then(() => {
                // resolved when lr has initalized
                if (args.PID) {
                    // all options on cmd line
                    return {
                        "PID": args.PID,
                        "information": args.information
                    };
                } else {
                    // interactive
                    return lr.getLandTitleInfo();
                }


            })
            .then((results) => {
                //console.log("AAA" + results);
                return lr.addLandTitleToRegistry(results);
            })

            .then((results) => {
                LOG.info('Land has been created and associated with your PID.');
            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }

    getLandTitleInfo() {
        let landquestions = [

            {
                name: 'PID',
                type: 'input',
                message: 'Enter your PID:',
                validate: function (value) {
                    if (value.length <= 10) {
                        return true;
                    } else {
                        return 'Please enter your PID.';
                    }
                }
            },

            {
                name: 'information',
                type: 'input',
                message: 'Enter a description of your land :',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a description of your land.';
                    }
                }
            },
        ]
        return inquirer.prompt(landquestions);


    }

    addLandTitleToRegistry(args) {

        const METHOD = 'getLandTitleInfo';

        LOG.info(METHOD, 'Getting assest from the registry.');
        let landID = "";
        let titleRegistry
        let setchar = "1234567890";

        for (let y = 0; y < 4; y++){
            landID += setchar.charAt(Math.floor(Math.random() * setchar.length));
        }
        console.log('land id' + ' ' + landID);
        //console.trace('C###hecking if person exists'+util.inspect(args));


        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')

            .then((result) => {
                titleRegistry = result;
                return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person')
            })
            .then((registry) => {
                console.log('Checking if person exists'+util.inspect(args));
                
                return registry.exists(args.PID);
            }).then(() => {
                LOG.info('LandRegistry:getLandTitleInfo', 'getting factory and adding assets');
                let factory = this.businessNetworkDefinition.getFactory();

                /** Create a new relationship for the owner */
                let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', args.PID);

                LOG.info('LandRegistry:addLandTitleToRegistry', 'Creating a land title#1');
                let landTitle1 = factory.newResource('net.biz.digitalPropertyNetwork', 'LandTitle', landID);
                landTitle1.owner = ownerRelation;
                landTitle1.information = args.information;


                LOG.info('LandRegistry:addLandTitleToRegistry', 'Adding these to the registry');
                return titleRegistry.addAll([landTitle1]);


            }).catch( (error)=>{
                console.log(error.stack);
                throw error;
            })
    };


    static addPerson(args) {

        let lr = new LandRegistry('landRegsitryUK');
        return lr.init()
            .then(() => {
                // resolved when lr has initalized
                if (args.firstName) {
                    // all options on cmd line
                    return {
                        "firstName": args.firstName,
                        "lastName": args.lastName
                        
                    };
                } else {
                    // interactive
                    return lr.getPerson();
                }


            })
            .then((composer) => {
                return lr.addPersonToRegistry(composer);
            })

            .then((results) => {
                LOG.info('Default titles added');
            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }

    getPerson(args) {





        let questions = [


            {
                name: 'firstName',
                type: 'input',
                message: 'Enter your first name:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your first name.';
                    }
                }
            },

            {
                name: 'lastName',
                type: 'input',
                message: 'Please enter your last name :',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your last name.';
                    }
                }
            },

        ]

        return inquirer.prompt(questions)



    }

    /** Add titles into the registry
    * @return {Promise} resolved when the assests have been created
 
  */
    addPersonToRegistry(composer) {
        LOG.info('LandRegistry:addPersonToRegistry', 'getting asset registry for "net.biz.digitalPropertyNetwork.LandTitle"');
        let owner;
        let ID;

        ID = "";

        let charset = "1234567890";

        for (let i = 0; i < 10; i++)
            ID += charset.charAt(Math.floor(Math.random() * charset.length));

        console.log(ID);

        LOG.info('about to get asset registry' + composer);
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle') // how do I know what this name is?

            .then((result) => {
                // got the assest registry for land titles
                LOG.info('LandRegistry:addPersonToRegistry', 'got asset registry');
                this.titlesRegistry = result;
            }).then(() => {
                LOG.info('LandRegistry:addPersonToRegistry', 'getting factory and adding assets');
                let factory = this.businessNetworkDefinition.getFactory();

                LOG.info('LandRegistry:addPersonToRegistry', 'Creating a person');
                owner = factory.newResource('net.biz.digitalPropertyNetwork', 'Person', ID);
                owner.firstName = composer.firstName;
                owner.lastName = composer.lastName;

                LOG.info('LandRegistry:addPersonToRegistry', 'Adding these to the registry');
                return this.titlesRegistry.addAll;


            }).then(() => {
                return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person');
            })
            .then((personRegistry) => {
                return personRegistry.add(owner);
            }) // and catch any exceptions that are triggered
            .catch(function (error) {
                console.log(error);
                LOG.error('LandRegsitry:_bootstrapTitles', error);
                throw error;
            });
    }








    /**
     * @description - run the listtiles command
     * @param {Object} args passed from the command line
     * @return {Promise} resolved when the action is complete
     */
    static submitCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');

        return lr.init()
            .then(() => {
                // resolved when lr has initalized
                if (args.PID) {
                    // all options on cmd line
                    return {
                        "PID": args.PID,
                        "LID": args.LID

                    };
                } else {
                    // interactive
                    return lr.updateForSale();
                }


            })
            .then((composer) => {
                return lr.updateForSales(composer);
            })

            .then((results) => {
                LOG.info('Transaction Submitted');
            })
            .catch(function (error) {
                /* potentially some code for generating an error specific message here */
                throw error;
            });
    }
}
module.exports = LandRegistry;
