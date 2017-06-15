#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Download specific version of docker-compose
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

echo "ABORT_BUILD=false" > ${DIR}/build.cfg
echo "ABORT_CODE=0" >> ${DIR}/build.cfg

echo ${TRAVIS_BUILD_ID}

#
echo "->- Build cfg being used"
cat ${DIR}/build.cfg
echo "-<-"


#
cd ${DIR}
