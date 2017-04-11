# Fabric Composer

This is a simple commandline-centric application to get started with the Fabric Composer framework quickly and easily.
Starting from nothing to an application running against and actual Hyperledger fabric.

npm install -g composer-cli
mkdir -p ~composer-connection-profiles/defaultProfiles
copy packages/getting-started connection.json profile to ~/.composer-connection-profiles/defaultProfiles
cd packages/getting-started run command:
 npm install
 npm deployNetwork
