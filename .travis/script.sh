#!/bin/bash
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

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

cd ${DIR} && pwd

mkdir "${DIR}"/fabric-tools 

# this should be moved to a better location
curl --output "${DIR}"/fabric-tools/fabric-dev-servers.zip https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip

unzip "${DIR}"/fabric-tools/fabric-dev-servers.zip -d "${DIR}"/fabric-tools
npm install -g composer-cli@latest
export PATH=$(npm bin -g):$PATH

"${DIR}"/fabric-tools/downloadFabric.sh
"${DIR}"/fabric-tools/startFabric.sh
"${DIR}"/fabric-tools/createPeerAdminCard.sh

# change into the repo directory
cd "${DIR}"
npm install
cd packages/digitalproperty-app
npm run deployNetwork
npm test


cd "${DIR}"/fabric-tools
./stopFabric.sh
./teardownFabric.sh


# Build the car builder application.
cd "${DIR}/packages/vehicle-manufacture-car-builder"
npm run build

# Build the install.sh script for vehicle-manufacture quick install
cd "${DIR}/packages/vehicle-manufacture"
./build.sh

exit 0
