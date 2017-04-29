#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Grab the root (parent) directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ME=`basename "$0"`

echo ${ME} `date`

source ${DIR}/build.cfg

if [ "${ABORT_BUILD}" = "true" ]; then
  echo "-#- exiting early from ${ME}"
  exit ${ABORT_CODE}
fi

cd ${DIR} && pwd


if [ "${SYSTEST}" != "" ]; then

    # Run the system tests.
    lerna run systest    
    
# We must be running unit tests.
else

    lerna run test
fi

exit 0
