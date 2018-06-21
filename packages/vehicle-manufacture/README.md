# Vehicle Manufacture Demo

## Installation

1. Run `./build.sh` from within the `vehicle-manufacture` package

This command creates a `install.sh` script (inside of installers/hlfv1) containing a payload of archived files

2. Run `cat installers/hlfv1/install.sh | bash` from within the `vehicle-manufacture` package

This executes the script (and payload) starting up several Docker images for each vehicle-lifecycle demo element as well as setting up Hyperledger Fabric and Composer.
Running this command will teardown any other running Docker images.

## Scenario
This demo is designed to show how a sample system could work using Hyperledger Composer to interact with a Blockchain for the handling the lifecycle of a vehicle. Of this lifecycle this demo covers the initial ordering and creating of a vehicle along with the oversight of these actions.

## Applications

### Vehicle Builder
This is an application that has been designed by the manufacturer **Arium** and is used by **Paul** a private owner to design his new vehicle and place the order with **Arium**. He can also use the application to view the status of his order in the manufacturing process.

Location localhost:8100.

You can also run this application on mobile using the instructions on the [Ionic Website](https://ionicframework.com/docs/intro/deploying/). When running the application on mobile you can point it to the REST server by pressing the cog icon on the login screen and updating the settings. This usually involves changing localhost to your PC's IP. Note that the REST server and mobile device need to be on the same network in most cases.

### Manufacturer Screen
This application displays to the manufacturer **Arium** the orders that have been placed with them through the *Vehicle Builder* application. Within this screen the manufacturer starts the manufacture on the order and updates the status of the order to mark where in the process the vehicle is.

Location localhost:6005

## VDA Screen
The VDA screen allows the regulator of the business network to keep track of the actions that are being performed on the network. It displays to them a view of the transactions that have occurred on the blockchain including details such as the time they occurred, their ID, what was performed and by who. It also displays the total number of registered vehicles they are regulating and which of these have their VIN's assigned and a registered owner.

Location localhost:6006

## Using this demo
Running this demo is performed within your web browser using the addresses specified above for each application. Begin by loading a tab or window in your browser for each of the applications.

Start with the **Vehicle Builder** application and click the button to "Build your car" this will take you to a new page where swiping left and right allows you to see the cars available for Paul to order. Clicking on the "Build" button below a vehicle image takes you to the configuration page where by clicking on the different sections such as "Trim" and then and item within such as "Executive" allows you to configure the vehicle to a specific specification. Clicking "Purchase and build" creates an order request for the manufacturer to act on and take you to the order status page where Paul can track the status his order is in as the manufacturer updates it.

Once you have placed Paul's order using the **Vehicle Builder** application navigate to the **Manufacturer Screen** where a card will have appeared which displays some details about the order and provides a button labeled "Start manufacture". Click this button to run the process of updating the status of the order placed by Paul. The status updates will be reflected on the card with the red dots changing to green as that status is set. Once the status delivery status is set to green you can navigate back to the **Vehicle Builder** and see that the status updates have been reflected within there.

If you now go to the **VDA Screen** you will see the list of transactions that were performed. The first transaction `PlaceOrder` is created when "Purchase and build" is pressed with the  **Vehicle Builder**. Four `UpdateOrderStatus` transactions are also visible within the screen, one for each of the status updates performed by the **Manufacturer Screen**. You can view the status updates that occurred by view the transactions in the block explorer above the transactions list, these updates should be `SCHEDULED FOR MANUFACTURE`, `VIN_ASSIGNED`, `OWNER_ASSIGNED` and `DELIVERED`. The values underneath "Registered Vehicles, "VIN Assigned" and "Owner Issued' should have been incremented by one. If this is the first pass through the demo these should now each read 14.

## How the demo works
### Business network model
The demo makes use of the Vehicle Manufacture Network sample which models within it the following:

#### Participants
`PrivateOwner` `Manufacturer` `Regulator`

#### Assets
`Order` `Vehicle`

#### Transactions
`PlaceOrder` `UpdateOrderStatus` `SetupDemo`

#### Events
`PlaceOrderEvent` `UpdateOrderStatusEvent`

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.