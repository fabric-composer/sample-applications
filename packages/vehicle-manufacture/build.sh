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

# Exit on first error, print all commands.
set -ev

# Grab the directory containing this script.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}/installers"

if [ -z ${DEMO_FABRIC_VERSION+x} ]; then
 echo "FABRIC_VERSION is unset, assuming hlfv1"
 export DEMO_FABRIC_VERSION="hlfv1"
else
 echo "DEMO_FABRIC_VERSION is set to '$DEMO_FABRIC_VERSION'"
fi

# clean up
rm -rf $DEMO_FABRIC_VERSION/fabric-dev-servers/
rm -f fabric-dev-servers.zip

# Get the fabric tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip

# Build all of the installers.
unzip -q fabric-dev-servers.zip -d $DEMO_FABRIC_VERSION/fabric-dev-servers/
$DEMO_FABRIC_VERSION/build.sh

# clean up
rm -rf $DEMO_FABRIC_VERSION/fabric-dev-servers/
rm -f fabric-dev-servers.zip