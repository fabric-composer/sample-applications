#!/bin/bash

# Exit on first error, print all commands.
set -ev

# Grab the directory containing this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/installers"

# clean up
rm -rf $VERSION/fabric-dev-servers/
rm -f fabric-dev-servers.zip

# Get the fabric tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip

# Build all of the installers.
VERSION=hlfv1
unzip -q fabric-dev-servers.zip -d $VERSION/fabric-dev-servers/
$VERSION/build.sh

# clean up
rm -rf $VERSION/fabric-dev-servers/
rm -f fabric-dev-servers.zip