#!/bin/bash

# Get current Directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#inlcude config.sh
. $DIR/config.sh

#Get Parrent Directory
Basefolder="$(cd ../; pwd)" 

# WEB SERVICES INSTALLATION
# echo "Installing Node & NPM"
#    if is_pione; then
    
#       wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.6/install.sh | bash
#       export NVM_DIR="$HOME/.nvm"
#       [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
#       nvm install node

#    elif is_pione_w; then

#       wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.6/install.sh | bash
#       export NVM_DIR="$HOME/.nvm"
#       [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
#       nvm install node

#    elif is_pitwo; then

#       curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#       sudo apt-get install -y nodejs 
#    elif is_pithree; then

#       curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#       sudo apt-get install -y nodejs 
#    else
#       echo 0
#    fi


cd $Basefolder/web

#install pm2 web server
sudo npm install --production
# sudo npm install pm2@latest -g
# sudo pm2 start process.json --env production
# sudo pm2 startup
# sudo pm2 save



