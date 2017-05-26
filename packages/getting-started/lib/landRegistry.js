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


const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
let config = require('config').get('gettingstarted');

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = config.get('participantId');
let participantPwd = config.get('participantPwd');
const LOG = winston.loggers.get('application');


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

  /** Updates a fixes asset for selling..
  @return {Promise} resolved when this update has compelted
  */
    updateForSale() {
        const METHOD = 'updateForSale';

        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get('LID:1148');

      }).then((result) => {

	      let factory        = this.businessNetworkDefinition.getFactory();
	      let transaction    = factory.newTransaction('net.biz.digitalPropertyNetwork','RegisterPropertyForSale');		
		  transaction.title  = factory.newRelationship('net.biz.digitalPropertyNetwork', 'LandTitle', 'LID:1148');
		  transaction.seller = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'PID:1234567890'); 	

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
        owner = factory.newInstance('net.biz.digitalPropertyNetwork', 'Person', 'PID:1234567890');
        owner.firstName = 'Fred';
        owner.lastName = 'Bloggs';

        /** Create a new relationship for the owner */
        let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'PID:1234567890');

        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#1');
        let landTitle1 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'LID:1148');
        landTitle1.owner = ownerRelation;
        landTitle1.information = 'A nice house in the country';

        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#2');
        let landTitle2 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'LID:6789');
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
        }).then((registry)  => {
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
        for(let i = 0; i < arrayLength; i++) {

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
        return(table);
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
    static listCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()
    .then(() => {
        return lr.listTitles();
    })

    .then((results) => {
        LOG.info('Titles listed');
        LOG.info('\n'+results.toString());
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
    static submitCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()

    .then(() => {
        return lr.updateForSale();
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
