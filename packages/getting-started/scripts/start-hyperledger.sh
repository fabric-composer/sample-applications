#!/bin/bash

# Exit on first error, print all commands.
set -ev

# Grab the current directorydirectory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

#
cd "${DIR}"/hlfv1

docker-compose -f hlfv1_alpha-docker-compose.yml down
docker-compose -f hlfv1_alpha-docker-compose.yml kill
docker-compose -f hlfv1_alpha-docker-compose.yml up -d

node create-channel.js
node join-channel.js
cd ../..
