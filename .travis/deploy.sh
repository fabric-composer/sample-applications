#!/bin/bash

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Grab the parent (root) directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
date
ME=`basename "$0"`

source ${DIR}/build.cfg

if [ "${ABORT_BUILD}" = "true" ]; then
  echo exiting early from ${ME}
  exit ${ABORT_CODE}
fi

# Check that this is the right node.js version.
if [ "${TRAVIS_NODE_VERSION}" != "" -a "${TRAVIS_NODE_VERSION}" != "6" ]; then
    echo Not executing as not running primary node.js version.
    exit 0
fi

# Check that this is not the system tests.
if [ "${SYSTEST}" != "" ]; then
    echo Not executing as running system tests.
    exit 0
fi

# Check that this is the main repository.
if [[ "${TRAVIS_REPO_SLUG}" != hyperledger* ]]; then
    echo "Skipping deploy; wrong repository slug."
    exit 0
fi

# are we building the docs?
if [ "${DOCS}" != "" ]; then
  if [ -z "${TRAVIS_TAG}" ]; then
    DOCS="unstable"
  else
    DOCS="full"
  fi
  ./.travis/deploy_docs.sh
  exit 0
fi


# Set the GitHub deploy key we will use to publish.
set-up-ssh --key "$encrypted_c6d9af089ec4_key" \
           --iv "$encrypted_c6d9af089ec4_iv" \
           --path-encrypted-key ".travis/github_deploy_key.enc"

# Change from HTTPS to SSH.
./.travis/fix_github_https_repo.sh

# Test the GitHub deploy key.
git ls-remote

# Log in to Docker Hub.
docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"

# This is the list of Docker images to build.
export DOCKER_IMAGES=(vehicle-lifecycle-car-builder vehicle-lifecycle-manufacturing vehicle-lifecycle-vda)
export VERSION=($(node -e "console.log(require('${DIR}/package.json').version)"))

# Push the code to npm.
if [ -z "${TRAVIS_TAG}" ]; then
    
    npm run pkgstamp
    for image in ${DOCKER_IMAGES}; do

        # Build the image and tag it with the version and unstable.
        docker build --build-arg VERSION=${VERSION} -t hyperledger/${image}:${VERSION}${DIR}/packages/${image}/docker
        docker tag hyperledger/${image}:${VERSION} hyperledger/${image}:unstable

        # Push both the version and unstable.
        docker push hyperledger/${image}:${VERSION}
        docker push hyperledger/${image}:unstable

    done

else
   
    # Build, tag, and publish Docker images.
    for image in ${DOCKER_IMAGES}; do

        # Build the image and tag it with the version and latest.
        docker build --build-arg VERSION=${VERSION} -t hyperledger/${image}:${VERSION} ${DIR}/packages/${image}/docker
        docker tag hyperledger/${image}:${VERSION} hyperledger/${image}:latest

        # Push both the version and latest.
        docker push hyperledger/${image}:${VERSION}
        docker push hyperledger/${image}:latest

    done

    # Configure the Git repository and clean any untracked and unignored build files.
    git config user.name "${GH_USER_NAME}"
    git config user.email "${GH_USER_EMAIL}"
    git checkout -b master
    git reset --hard
    git clean -d -f

    # Bump the version number.
    npm run pkgbump
    export NEW_VERSION=$(node -e "console.log(require('${DIR}/package.json').version)")

    # Add the version number changes and push them to Git.
    git add .
    git commit -m "Automatic version bump to ${NEW_VERSION}"
    git push origin master

fi
date