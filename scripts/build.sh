#!/bin/bash

# install NVM
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
. ~/.nvm/nvm.sh

# install NodeJS
nvm install 12.18.2

# install dependencies
cd /vagrant/application
npm install
