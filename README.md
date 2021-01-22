# Base React.JS Web App

This repository holds the source code for a simple web application using a REST API written in JavaScript using React.JS that can be used as the starter package for a new project. It also contains a virtual machine for local development.

This is a React.JS application using Ant Design (https://ant.design/) for the interface. It can be adjusted to fit any REST API, but is made to work out-of-the-box with https://github.com/okebinda/base.api.python.

Local development is run on a local virtual machine managed by Vagrant. To install the virtual machine, make sure you have installed Vagrant (https://www.vagrantup.com/) and a virtual machine provider, such as VirtualBox (https://www.virtualbox.org/).

## Manage Local Development Environment

### Provision Virtual Machine

Sets up the local development environment.

```ssh
> vagrant up
> vagrant ssh
$ cd /vagrant
$ ./scripts/build.sh
```

Also, to access the web application from your host machine you should update your local DNS to point the development domain to the virtual machine's IP address. For example, on a Mac/Linux box you can update your `/etc/hosts` file with the following line:

```
172.29.17.206 base.webapp.reactjs.vm
```

### Start Virtual Machine

Starts the local development environment. This is a prerequisite for any following steps if the machine is not already booted.

```ssh
> vagrant up
```

### Stop Virtual Machine

Stops the local development environment. Run this command from the host (i.e. log out of any virtual machine SSH sessions).

```ssh
> vagrant halt
```

### Delete Virtual Machine

Deletes the local development environment. Run this command from the host (i.e. log out of any virtual machine SSH sessions).

```ssh
> vagrant destroy
```

Sometimes it is useful to completely remove all residual Vagrant files after destroying the box, in this case run the additional command:

```ssh
> rm -rf ./vagrant
```

## Manage the Application

### Run Development Server

Runs the local development server in the console.

```ssh
> vagrant ssh
$ cd /vagrant/application
$ npm start
```

URL: http://base.webapp.reactjs.vm:3000

### Run Unit Tests

There are currently no unit tests.


## Deployment

[@todo] Add deployment scripts.


## Repository Directory Structure

| Directory/File      | Purpose       |
| ------------------- | ------------- |
| /application        | Contains all files required for the application to run |
|  ├─/public          | Any publically available web resouces, such as HTML, CSS, images, etc. |
|  ├─/src             | Application source code |
|  └─/package.json    | The Node.JS manifest file for the project |
| /scripts            | Contains various scripts, such as the script to build the application for the first time (installs dependencies) |
| /data               | Contains the data used to populate the application for development and testing, such as data fixtures |
| /deploy             | Deployment scripts |
|  └─/packages        | Contains packages created by the `make` script - can be temporary or committed |
| /documentation      | Documentation files |
| /provision          | Provision scripts for local virtual machine and production servers |
| /tests              | Unit tests |
| README.md           | This file |
| Vagrantfile         | Configuration file for Vagrant when provisioning local development virtual machine |
