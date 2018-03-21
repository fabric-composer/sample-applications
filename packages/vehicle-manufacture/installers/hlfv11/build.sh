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
npm install vehicle-manufacture-network@~0.2.1 --no-save

cd "${DIR}"
cat install.sh.in | sed \
    -e 's/{{COMPOSER-VERSION}}/next/g' \
    -e 's/{{VEHICLE-LIFECYCLE-VERSION}}/latest/g' \
    -e 's/{{NODE-RED-VERSION}}/next/g' \
    > install.sh
echo "PAYLOAD:" >> install.sh
tar czf - -C $DIR $ROOT/node_modules/vehicle-manufacture-network/dist -C $DIR flows.json fabric-dev-servers >> install.sh
