#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Grab the root (parent) directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Clean travis configured nvm/nodeJS so that we can create via our own script within install stage (in travis.yml)
# -Uninstall all node versions via nvm that travis has
source ~/.nvm/nvm.sh
nvm deactivate
nvm ls --no-colors v > node_versions.txt
while IFS= read line; do
    echo "Processing detected nodeJS version: ${line}"
    regex="[0-9].*[0-9]"
    if [[ $line =~ $regex ]]
    then
        version="${BASH_REMATCH[0]}"
        nvm uninstall $version
    fi
done <node_versions.txt

## -remove nvm 
echo "Removing nvm directory"
rm -rf ~/.nvm

echo "ABORT_BUILD=false" > ${DIR}/build.cfg
echo "ABORT_CODE=0" >> ${DIR}/build.cfg

echo ${TRAVIS_BUILD_ID}

#
echo "->- Build cfg being used"
cat ${DIR}/build.cfg
echo "-<-"


#
cd ${DIR}
