#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOT=$DIR/../..

cd $ROOT
npm install

cd "${DIR}"
cat install.sh.in | sed \
    -e 's/{{COMPOSER-VERSION}}/latest/g' \
    -e 's/{{VEHICLE-LIFECYCLE-VERSION}}/latest/g' \
    -e 's/{{NODE-RED-VERSION}}/latest/g' \
    > install.sh
echo "PAYLOAD:" >> install.sh
tar czf - -C $ROOT/node_modules/vehicle-lifecycle-network/dist vehicle-lifecycle-network.bna -C $DIR flows.json fabric-dev-servers >> install.sh

cd $ROOT
# unstable won't work as it pulls down the node 8 version of vehicle lifecycle network
# npm install vehicle-lifecycle-network@unstable

# cd "${DIR}"
# cat install.sh.in | sed \
#    -e 's/{{COMPOSER-VERSION}}/unstable/g' \
#    -e 's/{{VEHICLE-LIFECYCLE-VERSION}}/unstable/g' \
#    -e 's/{{NODE-RED-VERSION}}/unstable/g' \
#    > install-unstable.sh
#echo "PAYLOAD:" >> install-unstable.sh
# tar czf - -C $ROOT/node_modules/vehicle-lifecycle-network/dist vehicle-lifecycle-network.bna -C $DIR flows.json fabric-dev-servers >> install-unstable.sh