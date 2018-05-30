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

# REMOVE EXISTING REST SERVER, PLAYGROUND ETC
docker rm -f $(docker ps -a | grep hyperledger/* | awk '{ print $1 }')
docker rm -f $(docker ps -a | grep awjh/* | awk '{ print $1 }')

docker pull hyperledger/composer-playground:latest
docker pull hyperledger/composer-cli:latest
docker pull hyperledger/composer-rest-server:latest
docker pull awjh/letters-of-credit:latest

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# GET AND SETUP FABRIC
rm -rf $DIR/fabric-tools
mkdir $DIR/fabric-tools
chmod 777 $DIR/fabric-tools
cd $DIR/fabric-tools

curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
tar -xvf $DIR/fabric-tools/fabric-dev-servers.tar.gz
$DIR/fabric-tools/startFabric.sh

cd $DIR

# CREATE LOCATION FOR LOCAL CARD STORE
rm -rf $(pwd)/.loc-card-store
mkdir $(pwd)/.loc-card-store
chmod 777 $(pwd)/.loc-card-store

# CREATE CONNECTION PROFILE
rm -fr $(pwd)/loc-stage
mkdir $(pwd)/loc-stage
chmod 777 $(pwd)/loc-stage
echo '{
	"name": "hlfv1",
	"version": "1.0.0",
	"client": {
		"organization": "Org1",
		"connection": {
			"timeout": {
				"peer": {
					"endorser": "300",
					"eventHub": "300",
					"eventReg": "300"
				},
				"orderer": "300"
			}
		}
	},
	"orderers": {
		"orderer.example.com": {
			"url": "grpc://orderer.example.com:7050",
			"grpcOptions": {}
		}
	},
	"peers": {
		"peer0.org1.example.com": {
			"url": "grpc://peer0.org1.example.com:7051",
			"eventUrl": "grpc://peer0.org1.example.com:7053",
			"grpcOptions": {},
			"endorsingPeer": true,
			"chaincodeQuery": true,
			"ledgerQuery": true,
			"eventSource": true
		}
	},
	"channels": {
		"composerchannel": {
			"orderers": ["orderer.example.com"],
			"peers": {
				"peer0.org1.example.com": {}
			}
		}
	},
	"certificateAuthorities": {
		"ca.org1.example.com": {
			"url": "http://ca.org1.example.com:7054",
			"caName": "ca.org1.example.com"
		}
	},
	"organizations": {
		"Org1": {
			"mspid": "Org1MSP",
			"peers": ["peer0.org1.example.com"],
			"certificateAuthorities": ["ca.org1.example.com"]
		}
	},
	"x-type": "hlfv1",
	"x-commitTimeout": 100
}' > $(pwd)/loc-stage/connection.json

# CREATE PEER ADMIN CARD AND IMPORT
docker run \
  --rm \
  --network composer_default \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  -v $(pwd)/loc-stage:/home/composer/loc-stage \
  -v $(pwd)/fabric-tools/fabric-scripts/hlfv1/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp:/home/composer/PeerAdmin \
  hyperledger/composer-cli:latest \
  card create -p loc-stage/connection.json -u PeerAdmin -r PeerAdmin -r ChannelAdmin -f /home/composer/loc-stage/PeerAdmin.card -c PeerAdmin/signcerts/Admin@org1.example.com-cert.pem -k PeerAdmin/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk

docker run \
  --rm \
  --network composer_default \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  -v $(pwd)/loc-stage:/home/composer/loc-stage \
  -v $(pwd)/fabric-tools/fabric-scripts/hlfv1/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp:/home/composer/PeerAdmin \
  hyperledger/composer-cli:latest \
  card import -f /home/composer/loc-stage/PeerAdmin.card

# START PLAYGROUND
docker run \
  -d \
  --network composer_default \
  --name composer \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  -p 8080:8080 \
  hyperledger/composer-playground:latest

# WAIT FOR PLAYGROUND TO WAKE UP
sleep 5

# GET THE BNA
ROOT=$DIR/..
cd $ROOT
npm install
cd $DIR
cp $ROOT/node_modules/letters-of-credit-network/dist/letters-of-credit-network.bna letters-of-credit-network.bna

# INSTALL THE BNA
docker run \
  --rm \
  --network composer_default \
  -v $(pwd)/letters-of-credit-network.bna:/home/composer/letters-of-credit-network.bna \
  -v $(pwd)/loc-stage:/home/composer/loc-stage \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  hyperledger/composer-cli:latest \
  network install -c PeerAdmin@hlfv1 -a letters-of-credit-network.bna

NETWORK_VERSION=$(grep -o '"version": *"[^"]*"' $ROOT/node_modules/letters-of-credit-network/package.json | grep -o '[0-9]\.[0-9]\.[0-9]')

# START THE BNA
docker run \
  --rm \
  --network composer_default \
  -v $(pwd)/letters-of-credit-network.bna:/home/composer/letters-of-credit-network.bna \
  -v $(pwd)/loc-stage:/home/composer/loc-stage \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  hyperledger/composer-cli:latest \
  network start -n letters-of-credit-network -V $NETWORK_VERSION -c PeerAdmin@hlfv1 -A admin -S adminpw -f /home/composer/loc-stage/bnaadmin.card

docker run \
  --rm \
  --network composer_default \
  -v $(pwd)/loc-stage:/home/composer/loc-stage \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  hyperledger/composer-cli:latest \
  card import -f /home/composer/loc-stage/bnaadmin.card

# CREATE THE NEEDED PARTICIPANTS
docker run \
  --rm \
  --network composer_default \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  hyperledger/composer-cli:latest \
  transaction submit -c admin@letters-of-credit-network -d '{"$class": "org.example.loc.CreateDemoParticipants"}'

# SET CORRECT PERMISSIONS
docker exec \
  composer \
  find /home/composer/.composer -name "*" -exec chmod 777 {} \;

# START THE REST SERVER
docker run \
  -d \
  --network composer_default \
  --name rest \
  -v $(pwd)/.loc-card-store:/home/composer/.composer \
  -e COMPOSER_CARD=admin@letters-of-credit-network \
  -e COMPOSER_NAMESPACES=never \
  -p 3000:3000 \
  hyperledger/composer-rest-server:latest

#WAIT FOR REST SERVER TO WAKE UP
sleep 10

# START THE LOC APPLICATION
docker run \
-d \
--network composer_default \
--name vda \
-e REACT_APP_REST_SERVER_CONFIG='{"webSocketURL": "ws://localhost:3000", "httpURL": "http://localhost:3000/api"}' \
-p 6001:6001 \
hyperledger/letters-of-credit:latest

#WAIT FOR REACT SERVER TO WAKE UP
sleep 10

# OPEN THE APPLICATION
URLS="http://localhost:6001/tutorial http://localhost:6001/alice http://localhost:6001/matias http://localhost:6001/ella http://localhost:6001/bob http://localhost:8080 http://localhost:3000/explorer/"
case "$(uname)" in
"Darwin") open ${URLS}
          ;;
"Linux")  if [ -n "$BROWSER" ] ; then
	       	        $BROWSER http://localhost:6001/tutorial http://localhost:6001/alice http://localhost:6001/matias http://localhost:6001/ella http://localhost:6001/bob http://localhost:8080 http://localhost:3000/explorer/
	        elif    which x-www-browser > /dev/null ; then
                  nohup x-www-browser ${URLS} < /dev/null > /dev/null 2>&1 &
          elif    which xdg-open > /dev/null ; then
                  for URL in ${URLS} ; do
                          xdg-open ${URL}
	                done
          elif  	which gnome-open > /dev/null ; then
	                gnome-open http://localhost:6001/tutorial http://localhost:6001/alice http://localhost:6001/matias http://localhost:6001/ella http://localhost:6001/bob http://localhost:8080 http://localhost:3000/explorer/
	        else
    	            echo "Could not detect web browser to use - please launch Application and Composer Playground URL using your chosen browser ie: <browser executable name> http://localhost:8080 or set your BROWSER variable to the browser launcher in your PATH"
	        fi
          ;;
*)        echo "Playground not launched - this OS is currently not supported "
          ;;
esac