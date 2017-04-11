# Fabric Composer

This is a simple commandline-centric application to get started with the Fabric Composer framework quickly and easily.
Starting from nothing to an application running against and actual Hyperledger fabric.

Project contains script files allowing you to easily start a Hyperledger Fabric v1 instance. The `npm install` will start HLF for you. 


## Installation

Before starting the installation process, ensure that you have all of the required prerequisites but following the guide [here](https://fabric-composer.github.io/installing/manual_prerequisites.html)

1. Install Composer CLI

```bash
npm install -g composer-cli
```

2. Create a new connection profile directory

```bash 
mkdir -p ~/.composer-connection-profiles/defaultProfile
```

3. Create the file `~/.composer-connection-profiles/defaultProfile/connection.json`, and create the Hyperledger Fabric v1 compatible connection profile using this template

```
{
    "type": "hlfv1",
    "orderers": [
        "grpc://localhost:7050"
    ],
    "ca": "https://localhost:7054",
    "peers": [
        {
            "requestURL": "grpc://localhost:7051",
            "eventURL": "grpc://localhost:7053"
        },
        {
            "requestURL": "grpc://localhost:7056",
            "eventURL": "grpc://localhost:7058"
        }
    ],
    "keyValStore": "/home/<username>/.hfc-key-store",
    "channel": "mychannel",
    "mspID": "Org1MSP",
    "deployWaitTime": "300",
    "invokeWaitTime": "100"
}

```

4. Start the Hyperledger Fabric docker images and deploy the `digitalProperty-network` business network

```bash
npm install
```

This will check if you have `composer-cli` installed, install all of the guide's dependencies, download the Hyperledger Fabric docker images, start the Fabric instance and deploy the business network

5. Run the unit tests, create some sample assets and run a transaction changing the status of a property

```bash
npm test
```

