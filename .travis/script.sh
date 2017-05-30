#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Grab the root (parent) directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ME=`basename "$0"`

echo ${ME} `date`

#source ${DIR}/build.cfg

#if [ "${ABORT_BUILD}" = "true" ]; then
#  echo "-#- exiting early from ${ME}"
#  exit ${ABORT_CODE}
#fi

#cd ${DIR} && pwd


cd "${DIR}"

mkdir ./fabric-tools && cd ./fabric-tools

# this should be moved to a better location
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip

unzip fabric-dev-servers.zip
./downloadFabric.sh
./startFabric.sh
./createComposerProfile.sh

# change into the repo direcoty
cd "${DIR}"
npm install
cd packages/digitalproperty-app
npm run deployNetwork
npm test


cd "${DIR}"/fabric-tools
./stopFabric.sh
./teardownFabric.sh


exit 0
