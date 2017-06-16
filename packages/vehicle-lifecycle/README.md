# Vehicle Lifecycle Demo

## Installation

1. Run `./build.sh`

This command creates a `install.sh` script containing a payload with the contents of this directory

2. Run `cat ./install.sh | bash`

This executes the script (and payload) starting up several Docker images for each vehicle-lifecycle demo element.
Running this command will teardown any other running Docker images.