#!/bin/bash

# install NVM
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
. ~/.nvm/nvm.sh

# install NodeJS
nvm install 14.15.4

# install dependencies
cd /vagrant/application
npm install
