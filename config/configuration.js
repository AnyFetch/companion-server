'use strict';

var Anyfetch = require ('anyfetch');

/**
 * @file Defines the app settings.
 *
 * Will set the path to Mongo, and applications id
 * Most of the configuration can be done using system environment variables.
 */

// Load environment variables from .env file
var dotenv = require('dotenv');
dotenv.load();

// node_env can either be "development" or "production"
var node_env = process.env.NODE_ENV || "development";
var port = process.env.PORT || 8000;

var managerUrl = process.env.MANAGER_URL || 'https://manager.anyfetch.com';
var apiUrl = process.env.API_URL || 'https://api.anyfetch.com';
var apiId =  process.env.ANYFETCH_API_ID;
var apiSecret = process.env.ANYFETCH_API_SECRET;

if(node_env === 'test') {
  managerUrl = 'http://localhost:8001';
  apiUrl = 'http://localhost:8002';
  apiId = 'test';
  apiSecret = 'test';
}

Anyfetch.setApiUrl(apiUrl);
Anyfetch.setManagerUrl(managerUrl);

// Third party services
var services = {};
services.opbeat = {
  organization_id: process.env.OPBEAT_ORG_ID,
  app_id: process.env.OPBEAT_APP_ID,
  secret_token: process.env.OPBEAT_TOKEN,
  silent: true,
};

// Exports configuration
module.exports = {
  env: node_env,
  port: port,

  mongoUrl: process.env.MONGO_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/' + node_env,

  appId: apiId,
  appSecret: apiSecret,

  companionUrl: process.env.COMPANION_URL || 'http://localhost:' + port,
  managerUrl: managerUrl,
  apiUrl: apiUrl,

  doneEndpoint: process.env.DONE_ENDPOINT || 'https://localhost/done/',

  services: services
};
