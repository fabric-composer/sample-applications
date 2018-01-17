#!/bin/bash

# Exit on first error, print all commands.
set -ev

# Grab the directory containing this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/installers"

if [ -z ${DEMO_FABRIC_VERSION+x} ]; then
 echo "FABRIC_VERSION is unset, assuming hlfv1"
 export DEMO_FABRIC_VERSION="hlfv1"
else
 echo "DEMO_FABRIC_VERSION is set to '$DEMO_FABRIC_VERSION'"
fi

# clean up
rm -rf $DEMO_FABRIC_VERSION/fabric-dev-servers/
rm -f fabric-dev-servers.zip

# Get the fabric tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip

# Build all of the installers.
unzip -q fabric-dev-servers.zip -d $DEMO_FABRIC_VERSION/fabric-dev-servers/
$DEMO_FABRIC_VERSION/build.sh

# clean up
rm -rf $DEMO_FABRIC_VERSION/fabric-dev-servers/
rm -f fabric-dev-servers.zip