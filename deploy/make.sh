#!/usr/bin/env bash

############################################
#
# Make
#
#  Creates a ZIP package of the Javascript application and its dependencies.
#
#  Usage: make.sh [OPTIONS] [TAG]
#
#  Arguments:
#   TAG:      [optional] Appends the argument to the package name for versioning.
#             Default behavior is to use the current Unix timestamp.
#
#  Options:
#   -u : Upload package to S3 bucket.
#
#  Requirements:
#    1) Configure awscli on VM (for -u option)
#
#  Examples:
#
#    * Create a default package for the application. Appends the Unix timestamp to
#      package name for versioning.
#
#        ./make.sh
#
#    * Create a default package with for the application. Appends the first
#      argument to package name for versioning.
#
#        ./make.sh 1.0.2
#
#    * Create a default package for the application. Uploads the package to S3
#      bucket. Appends the first argument to package name for versioning.
#
#        ./make.sh -u 1.4.12
#
############################################

# package params
PACKAGE_NAME="webapp.domain.com"

# aws params
BUCKET_NAME="code.domain.com"

# directories
BASE_DIR="/vagrant"
APP_DIR="${BASE_DIR}/application"
PACKAGE_DIR="${BASE_DIR}/deploy/packages"

# flags
UPLOAD_PACKAGE=false

while getopts 'u' flag; do
  case "${flag}" in
      u) UPLOAD_PACKAGE=true ;;
      *) error "Unexpected option ${flag}" ;;
    esac
done
shift $((OPTIND-1))

# get tag or timestamp for filename
if [ $1 ];
then
    tag=$1
else
    tag=$(date +%s)
fi

# build filename
filename="${PACKAGE_DIR}/${PACKAGE_NAME}-${tag}.zip"

# make zip if file doesn't already exist
if [ -e $filename ];
then
    echo "Filename: '${filename}' already exists."
else

  # APPLICATION SOURCE

  #  zip options:
  #   -r: recursive
  #   -y: store symbolic links as symbolic links (i.e.: do not create a new copy)
  #   -9: compression level (max)
  cd $APP_DIR
  npm run build
  cd build
  zip -ry9 $filename *
  cd $APP_DIR
  rm -rf build

  # UPLOAD TO S3

  if [ "$UPLOAD_PACKAGE" = true ]
  then
      # upload package to S3 bucket
      echo "Uploading package..."
      if ! aws s3 cp $filename "s3://${BUCKET_NAME}/${PACKAGE_NAME}-${tag}.zip" ; then
          echo "Package upload failed. Aborting."
          exit
      fi
      echo "Complete."
  fi

  echo
  echo "Package created: ${filename}"
  echo

fi
