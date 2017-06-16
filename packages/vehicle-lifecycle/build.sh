#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"
cp -f install.sh.in install.sh
echo "PAYLOAD:" >> install.sh
tar czf - .composer-connection-profiles .hfc-key-store crypto-config docker-compose.yml flows.json mychannel.tx twoorgs.orderer.block vehicle-lifecycle-network.bna >> install.sh
