#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOT=$DIR/../..

cd $ROOT
npm install

cd "${DIR}"
cat install.sh.in | sed 's/{{ENV}}/latest/g' > install.sh
echo "PAYLOAD:" >> install.sh
tar czf - -C $ROOT/node_modules/vehicle-lifecycle-network/dist vehicle-lifecycle-network.bna -C $DIR flows.json fabric-dev-servers >> install.sh

cd $ROOT
npm install vehicle-lifecycle-network@unstable

cd "${DIR}"
cat install.sh.in | sed 's/{{ENV}}/unstable/g' > install-unstable.sh
echo "PAYLOAD:" >> install-unstable.sh
tar czf - -C $ROOT/node_modules/vehicle-lifecycle-network/dist vehicle-lifecycle-network.bna -C $DIR flows.json fabric-dev-servers >> install-unstable.sh