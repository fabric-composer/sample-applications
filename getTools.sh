#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mkdir ${DIR}/fabric-tools && cd ${DIR}/fabric-tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip -q fabric-dev-servers.zip
rm fabric-dev-servers.zip
cd ${DIR}
