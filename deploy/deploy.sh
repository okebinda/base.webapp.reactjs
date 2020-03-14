#!/usr/bin/env bash

############################################
#
# Deploy
#
#  Logs in to the application server, downloads a ZIP package of the Javascript
#  application and its dependencies (created by the make.sh script) from an S3
#  bucket, installs and activates it. If the package already exists on the
#  server it will skip the download step and reactivate the previous package - 
#  in this way it can act as a rollback operation.
#
#  Usage: deploy.sh [OPTIONS] [FILENAME]
#
#  Arguments:
#   FILENAME: [required] The filename ZIP package in the S3 bucket for deployment.
#
#  Options:
#   -p : Promote the new package to production.
#   -F : Force re-download of package if it already exists.
#   -P : Deply the package to the production server. Default is to use the development
#        environment.
#
#  Requirements:
#    1) Add SSH key to VM
#    2) Use SSH to login to server interactively first time to accept server's public key
#    3) Configure awscli on server
#
#  Examples:
#
#    * Copy the package to the server.
#
#        ./deploy.sh host.domain.com-1.1.4.165.zip
#
#    * Deploy the package to the development server, update the web server's live
#      symlink to point to the new package directory and restart the systemd service to
#      reload the bytecode.
#
#        ./deploy.sh -p host.domain.com-1.1.4.165.zip
#
#    * Deploy the package to the production server, update the web server's live
#      symlink to point to the new package directory and restart the systemd service to
#      reload the bytecode.
#
#        ./deploy.sh -pP host.domain.com-1.1.4.165.zip
#
############################################

# environment -> base domain names
declare -A base_domain_names=(
    [development]="dev.domain.com"
    [production]="domain.com"
)

# environment -> servers
declare -A server_ip_or_hosts=(
    [development]="dev.domain.com"
    [production]="domain.com"
)

# params
HOST_NAME="webapp"
BUCKET_NAME="code.domain.com"
SSH_KEY="/home/vagrant/.ssh/SSH_KEY.pem"
SERVER_USER="ubuntu"
SERVER_APP_USER="app_username"

# flags
PROMOTE_PACKAGE=false
FORCE_REDOWNLOAD=false
PRODUCTION_DEPLOYMENT=false

while getopts 'FpP' flag; do
  case "${flag}" in
      p) PROMOTE_PACKAGE=true ;;
      F) FORCE_REDOWNLOAD=true ;;
      P) PRODUCTION_DEPLOYMENT=true ;;
      *) error "Unexpected option ${flag}" ;;
    esac
done
shift $((OPTIND-1))

# INPUT CHECKS

if [ -z "$1" ];
  then
    echo "Please specify a filename in the S3 bucket [${BUCKET_NAME}] to deploy."
    echo "Usage: deploy.sh [OPTIONS] [FILENAME]"
    exit 0
fi

# DEPLOYMENT

# assign domains based on environment
if [ "$PRODUCTION_DEPLOYMENT" = true ]; then
    SERVER_IP_OR_HOST="${server_ip_or_hosts[production]}"
    DOMAIN_NAME="${HOST_NAME}.${base_domain_names[production]}"
else
    SERVER_IP_OR_HOST="${server_ip_or_hosts[development]}"
    DOMAIN_NAME="${HOST_NAME}.${base_domain_names[development]}"
fi

# assign directories and services
SERVER_DOWNLOAD_DIR="/home/${SERVER_USER}"
SERVER_APP_DIR="/home/${SERVER_APP_USER}/${DOMAIN_NAME}"
SERVER_PROD_DIR="/var/www/vhosts/${DOMAIN_NAME}"
SERVER_SERVICE_NAME="${DOMAIN_NAME}"

# assign args to local vars
FILE_NAME=$1

# parse the file id from the full filename
FILE_ID=$(basename "$FILE_NAME" .zip)

# log in to server
ssh -i $SSH_KEY "${SERVER_USER}@${SERVER_IP_OR_HOST}" << EOF

echo

# if package is already installed on server, skip download and unpacking
if [ -e "${SERVER_APP_DIR}/${FILE_ID}" ] && [ ! $FORCE_REDOWNLOAD = true ] ; then
    echo "${SERVER_APP_DIR}/${FILE_ID} already exists. Skipping download."
else

    # change to download directory
    if ! cd ${SERVER_DOWNLOAD_DIR} ; then
        echo "Could not change to ${SERVER_DOWNLOAD_DIR} directory. Aborting."
        exit
    fi

    # download package
    echo "Downloading package..."
    if ! aws s3 cp "s3://${BUCKET_NAME}/${FILE_NAME}" . ; then
        echo "Package download failed. Aborting."
        exit
    fi
    echo "Complete."

    # remove old files if they exist
    if [ $FORCE_REDOWNLOAD = true ] && [ -e "${SERVER_APP_DIR}/${FILE_ID}" ] ; then
        echo "Deleting existing package: ${SERVER_APP_DIR}/${FILE_ID}"
        sudo su ${SERVER_APP_USER} -c "rm -rf ${SERVER_APP_DIR}/${FILE_ID}"
    fi

    # change to application directory
    if ! cd ${SERVER_APP_DIR} ; then
        echo "Could not change to ${SERVER_APP_DIR} directory. Aborting."
        exit
    fi

    # create new application build directory
    if ! sudo su ${SERVER_APP_USER} -c "mkdir -p ${FILE_ID}" ; then
        echo "Could not create ${FILE_ID} directory. Aborting."
        exit
    fi

    # change to new application build directory
    if ! sudo su ${SERVER_APP_USER} -c "cd ${SERVER_APP_DIR}/${FILE_ID}" ; then
        echo "Could not change to ${SERVER_APP_DIR}/${FILE_ID} directory. Aborting."
        exit
    fi

    # unzip package to app build directory
    echo "Extracting package..."
    if ! sudo su ${SERVER_APP_USER} -c "unzip -qo ${SERVER_DOWNLOAD_DIR}/${FILE_NAME} -d ${SERVER_APP_DIR}/${FILE_ID}" ; then
        echo "Could not unzip ${SERVER_DOWNLOAD_DIR}/${FILE_NAME} into ${SERVER_APP_DIR}/${FILE_ID}. Aborting."
        exit
    fi
    echo "Complete."

    # cleanup
    if ! rm "${SERVER_DOWNLOAD_DIR}/${FILE_NAME}" ; then
        echo "Could not delete ${SERVER_DOWNLOAD_DIR}/${FILE_NAME}."
    fi
    echo "Package download removed."
fi

# promote new package to production
if [ "${PROMOTE_PACKAGE}" = true ] ; then

    # symlink app build directory to production web server directory
    if ! sudo su ${SERVER_APP_USER} -c "ln -sfn ${SERVER_APP_DIR}/${FILE_ID} ${SERVER_PROD_DIR}/web" ; then
        echo "Could not symlink ${SERVER_APP_DIR}/${FILE_ID} to ${SERVER_PROD_DIR}/web. Aborting."
        exit
    fi
    echo "Symlink updated."

    # restart application service
    if ! sudo systemctl reload nginx.service ; then
        echo "Could not reload nginx.service. Aborting."
        exit
    fi
    echo "Service restarted."

    # update CHANGELOG
    sudo su ${SERVER_APP_USER} -c "echo \"$(date): ${FILE_ID}\" >> ${SERVER_APP_DIR}/CHANGELOG.txt"
fi

echo 
echo "Deployment complete."
echo

EOF
