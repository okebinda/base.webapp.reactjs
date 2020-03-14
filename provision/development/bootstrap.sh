#!/bin/sh

############################
#
# BASE.WEBAPP.REACTJS.VM
#
#  Development Bootstrap
#
#  Ubuntu 18.04
#  https://www.ubuntu.com/
#
#  Packages:
#   vvim tmux screen git zip
#   awscli
#
#  author: https://github.com/okebinda
#  date: December, 2019
#
############################


#################
#
# System Updates
#
#################

# get list of updates
apt-get update

# update all software
apt-get upgrade -y


####################
#
# Update Networking
#
####################

echo "
172.29.17.200 base.api.python.vm base.api.admin.python.vm
" >> /etc/hosts


################
#
# Install Tools
#
################

apt-get install vim tmux screen git zip -y

# install AWS command line interface
apt-get install awscli -y


###############
#
# VIM Settings
#
###############

su vagrant <<EOSU
echo 'syntax enable
set hidden
set history=100
set number
filetype plugin indent on
set tabstop=4
set shiftwidth=4
set expandtab' > ~/.vimrc
EOSU
