#!/bin/sh

############################
#
# BASE.WEBAPP.REACTJS.VM
#
#  Development Bootstrap
#
#  Ubuntu 20.04
#  https://www.ubuntu.com/
#
#  Packages:
#   vvim tmux screen git zip
#   awscli
#
#  author: https://github.com/okebinda
#  date: July, 2020
#
############################


#################
#
# System Updates
#
#################

# get list of updates
apt update

# update all software
apt upgrade -y


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

apt install -y vim tmux screen git zip

# install AWS command line interface
apt install -y awscli


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
