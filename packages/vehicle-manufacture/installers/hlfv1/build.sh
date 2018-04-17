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
#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOT=$DIR/../..

cd $ROOT
npm install

NETWORK_VERSION=$(grep -o '"version": *"[^"]*"' $ROOT/node_modules/vehicle-manufacture-network/package.json | grep -o '[0-9]\.[0-9]\.[0-9]')

cd "${DIR}"
cat install.sh.in | sed \
    -e 's/{{COMPOSER-VERSION}}/latest/g' \
    -e 's/{{VEHICLE-MANUFACTURE-VERSION}}/latest/g' \
    -e 's/{{NODE-RED-VERSION}}/latest/g' \
    -e "s/{{NETWORK-VERSION}}/$NETWORK_VERSION/g" \
    > install.sh
echo "PAYLOAD:" >> install.sh
tar czf - -C $ROOT/node_modules/vehicle-manufacture-network/dist vehicle-manufacture-network.bna -C $DIR flows.json fabric-dev-servers >> install.sh

cd $ROOT
npm install vehicle-manufacture-network@unstable --no-save

UNSTABLE_NETWORK_VERSION=$(grep -o '"version": *"[^"]*"' $ROOT/node_modules/vehicle-manufacture-network/package.json | grep -o '[0-9]\.[0-9]\.[0-9]')

cd "${DIR}"
cat install.sh.in | sed \
    -e 's/{{COMPOSER-VERSION}}/unstable/g' \
    -e 's/{{VEHICLE-MANUFACTURE-VERSION}}/unstable/g' \
    -e 's/{{NODE-RED-VERSION}}/unstable/g' \
    -e "s/{{NETWORK-VERSION}}/$UNSTABLE_NETWORK_VERSION/g" \
    > install-unstable.sh
echo "PAYLOAD:" >> install-unstable.sh
tar czf - -C $ROOT/node_modules/vehicle-manufacture-network/dist vehicle-manufacture-network.bna -C $DIR flows.json fabric-dev-servers >> install-unstable.sh
