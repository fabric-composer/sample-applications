#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Call prereqs script
./packages/getting-started/scripts/prereqs-ubuntu.sh

# more configuration
source ${HOME}/.nvm/nvm.sh
npm install -g npm
npm install -g lerna