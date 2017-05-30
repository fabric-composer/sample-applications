#!/bin/bash
# check if the user is root, and exit with error
if [ "$(id -u)" == 0 ]; then 
  echo "Do not run as root"
  exit 1
fi