#!/usr/bin/env bash
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

set -ev
VERSION=$(node -e 'console.log(require("digitalproperty-network/package.json").version)')
composer archive create --sourceName digitalproperty-network --sourceType module --archiveFile digitalPropertyNetwork.bna
composer network install --archiveFile ./digitalPropertyNetwork.bna --card PeerAdmin@hlfv1
composer network start --networkName digitalproperty-network --networkVersion ${VERSION} --card PeerAdmin@hlfv1 -A admin -S adminpw -l INFO
composer card import --file ./admin@digitalproperty-network.card
composer network list --card admin@digitalproperty-network