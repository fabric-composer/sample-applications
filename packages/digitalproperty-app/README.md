# Hyperledger Composer - Tutorial 2 - Running a local application

Follow the instructions below to get started by standing up a Hyperledger Fabric, and then getting a simple Hyperledger Composer Business Network deployed and an application running against it. A 'Getting Started' application.

There are two version of Hyperledger Fabric : v0.6 and v1.0-alpha.  The default is for v1.0-alpha and we suggest this is the one you use.

## Step 1: Getting Hyperledger Fabric running

These scripts use Node v6, and bash, which are Hyperledger Composer depencies. Choose a directory that you wish to have the setup scripts within.

1. In a directory of your choice (will assume `~/fabric-tools`) get the zip file that contains the tools.  There are both .zip and .tar.gz formats
```
$ mkdir ~/fabric-tools && cd ~/fabric-tools
$ curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/fabric-dev-servers/fabric-dev-servers.zip
$ unzip fabric-dev-servers.zip
```

```
$ mkdir ~/fabric-tools && cd ~/fabric-tools
$ curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
$ tar xvz fabric-dev-servers.tar.gz

```

2. Choose which version of Fabric to use. For v0.6 this needs to be set explicitly as follows.

```
$ export FABRIC_VERSION=hlfv0.6
```

For v1.0-alpha, there is *nothing to as this the default*. But to 'unset' the v0.6, or to be explicit in using v1 use this command

```
$ export FABRIC_VERSION=hlfv1
```

3. If this is the first time, you'll need to download the fabric first. If you have already downloaded then first start the fabric, and create a Composer profile.  After that you can then choose to stop the fabric, and start it again later. Alternatively to completely clean up you can teardown the Fabric and the Composer profile.

All the scripts will be in the directory `~/fabric-tools`  A typical sequence  for Hyperledger Composer use would be

```
$ cd ~/fabric-tools
$ ./downloadFabric.sh
$ ./startFabric.sh
$ ./createComposerProfile.sh
```

Then at the end of your development session

```
$ cd ~/fabric-tools
$ ./stopFabric.sh
$ ./teardownFabric.sh
```

*If you want to swap between v0.6 and v1.0, ensure you have issued a `stopFabric.sh` and a `teardownFabric.sh` command first be START on the other version*

## Script details

### Downloading Fabric

Issue from the `fabric-tools` directory
```
$ ./downloadFabric.sh
```

### Starting Fabric

Issue  from the `fabric-tools` directory
```
$ ./startFabric.sh
```

### Stop Fabric

Issue from the `fabric-tools` directory
```
$ ./stop.sh
```

By default, this script will pause for 15seconds to let Fabric start - on some systems this isn't enough. If you see fails in running `startFabric.sh` you can alter this value. It's controlled by a environment variable that takes a numeric value representing the number of seconds to wait.

```
$ export FABRIC_START_TIMEOUT=30
```

### Create Composer Profile

Issue from the `fabric-tools` directory
```
$ ./createComposerProfile.sh
```

Note: this create a Hyperledger Composer profile specifically to connect to the development fabric you've already started.

### Teardown Fabric

Issue from the `fabric-tools` directory
```
$ ./teardownFabric.sh
```


### Command Ordering

This diagram should to clarify the order in which the scripts can be run.  Remember the version will default to hlfv1 if the version command is not run.

![](CmdOrder.png).


# Step 2: Getting the Hyperledger Composer sample application

0. Make sure you've started Fabric as in Step 1 above. For example, If this is your first time for exaple

```
$ cd ~/fabric-tools
$ ./downloadFabric.sh
$ ./startFabric.sh
$ ./createComposerProfile.sh
```

1. Clone the sample application into a directory of your choice - BUT not the same directory as in Step 1. (Assume `~/github')
```
$ mkdir ~/github && cd ~/github
$ git clone https://github.com/mbwhite/composer-sample-applications
$ cd composer-sample-applications
$ npm install
```

To see a summary of all the sample applications, there's a simple command that will show summary details of the applications
A useful information node.js script has been created to show the available sample applications
```
$ node ~/github/composer-sample-applications/info.js
```

2. When you started fabric you will have chosen which version to use.  If you have chosen Fabirc v0.6 you will need to suffix the targets in the npm commands below with `:hlfv06`. Both examples are given below - do not issue both commands!

*Note: this does not change the application source code or the model, purely the name of the Composer profile to use, and the Fabric's admin indentity*

3. Deploy the business network

```
$ cd packages/getting-started
$ npm run deployNetwork
$ npm run deployNetwork:hlfv0.6     # if you want to use v0.6
```

5. Run the sample application
```
$ npm test
$ npm test:hlfv0.6     # if you want to use v0.6
```



