#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Grab the root (parent) directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

echo "ABORT_BUILD=false" > ${DIR}/build.cfg
echo "ABORT_CODE=0" >> ${DIR}/build.cfg

echo ${TRAVIS_BUILD_ID}

#
echo "->- Build cfg being used"
cat ${DIR}/build.cfg
echo "-<-"


#
cd ${DIR}
