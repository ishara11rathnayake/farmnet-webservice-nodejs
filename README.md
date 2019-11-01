# Project Title

Farmer and Buyer Networking System - FarmNET

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Node.js
MongoDB Atlas account
Text editor (Visual Studio Code, Atom, Sublime, Vim)
Postman
```

### Installing

A step by step series of examples that tell you how to get a development env running

1.Clone the repository master branch
```sh
$ git https://github.com/ishara11rathnayake/farmnet-webservice-nodejs.git
```

2.Install all needed packages using
```sh
npm install
```
3.Create the env files and set 
```sh
MONGO_ATLAS_PW = somthing
JWT_KEY = something
```
3. to run the project
```sh
npm start
```

## Deployment

Here is an example on how to deploy to Heroku using Heroku CLI:
```
# start a new local git repository
git init

# create a new heroku app
heroku apps:create my-new-app

# add heroku remote reference to the local repository
heroku git:remote --app my-new-app

# add the MongoLab addon to the heroku app
heroku addons:create mongolab

# set the environment variables to the heroku app (see the .env file in root directory)
heroku config:set MASTER_KEY=masterKey JWT_SECRET=jwtSecret

# commit and push the files
git add -A
git commit -m "Initial commit"
git push heroku master

# open the deployed app in the browser
heroku open
```
The second time you deploy, you just need to:
``
git add -A
git commit -m "Update code"
git push heroku master
``

## Built With

* [EXPRESS](https://expressjs.com/en/api.html) - web framework for Node.js
* [NPM](https://docs.npmjs.com/) - package manager

## Authors

* **Ishara Rathnayake** 
