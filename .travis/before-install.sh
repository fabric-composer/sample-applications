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

# Download specific version of docker-compose
export DOCKER_COMPOSE_VERSION=1.11.2
sudo rm /usr/local/bin/docker-compose
curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
sudo mv docker-compose /usr/local/bin
echo "Docker-compose version: " 
docker-compose --version

# Update docker
sudo apt-get update
sudo apt-get remove docker docker-engine
sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce
echo "Docker version: " 
docker --version

# Grab the parent (root) directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

npm install -g @alrra/travis-scripts
npm install -g cordova

echo "ABORT_BUILD=false" > ${DIR}/build.cfg
echo "ABORT_CODE=0" >> ${DIR}/build.cfg

# Abort the systest if this is a merge build
# Check for the FC_TASK that is set in travis.yml, also the pull request is false => merge build
# and that the TRAVIS_TAG is empty meaning this is not a release build
if [ "${FC_TASK}" = "systest" ] && [ "${TRAVIS_PULL_REQUEST}" = "false" ] && [ -z "${TRAVIS_TAG}" ]; then
  if [[ "${TRAVIS_REPO_SLUG}" = hyperledger* ]]; then
    echo "ABORT_BUILD=true" > ${DIR}/build.cfg
    echo "ABORT_CODE=0" >> ${DIR}/build.cfg
    echo Merge build from non release PR: ergo not running systest
    exit 0
  fi
fi

#
echo "->- Build cfg being used"
cat ${DIR}/build.cfg
echo "-<-"

cd ${DIR}
