#!/bin/bash

# install NVM
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
. ~/.nvm/nvm.sh

# install NodeJS
nvm install 12.13.0

# install dependencies
cd /vagrant/application
npm install
