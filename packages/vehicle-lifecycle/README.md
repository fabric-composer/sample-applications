# Vehicle Lifecycle Demo

## Installation

1. Run `./build.sh` from within the `vehicle-lifecycle` package

This command creates a `install.sh` script (inside of installers/hlfv1) containing a payload of archived files

2. Run `cat installers/hlfv1/install.sh | bash` from within the `vehicle-lifecycle` package

This executes the script (and payload) starting up several Docker images for each vehicle-lifecycle demo element.
Running this command will teardown any other running Docker images.