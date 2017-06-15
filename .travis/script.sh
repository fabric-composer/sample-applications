#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

export DOCKER_COMPOSE_VERSION=1.11.2
sudo rm /usr/local/bin/docker-compose
curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
sudo mv docker-compose /usr/local/bin
echo "Docker-compose version: " 
docker-compose --version

# Update docker
sudo apt-get update
sudo apt-get remove docker docker-engine
sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce
echo "Docker version: " 
docker --version


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
