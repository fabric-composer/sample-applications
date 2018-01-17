#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOT=$DIR/../..

cd $ROOT
npm install vehicle-manufacture-network@~0.2.1 --no-save

cd "${DIR}"
cat install.sh.in | sed \
    -e 's/{{COMPOSER-VERSION}}/next/g' \
    -e 's/{{VEHICLE-LIFECYCLE-VERSION}}/latest/g' \
    -e 's/{{NODE-RED-VERSION}}/next/g' \
    > install.sh
echo "PAYLOAD:" >> install.sh
tar czf - -C $DIR $ROOT/node_modules/vehicle-manufacture-network/dist -C $DIR flows.json fabric-dev-servers >> install.sh
