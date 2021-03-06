'use strict';

var Anyfetch = require('anyfetch');

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
var nodeEnv = process.env.NODE_ENV || "development";
var port = process.env.PORT || 8000;

var managerUrl = process.env.MANAGER_URL || 'https://manager.anyfetch.com';
var apiUrl = process.env.API_URL || 'https://api.anyfetch.com';
var apiId =  process.env.ANYFETCH_API_ID;
var apiSecret = process.env.ANYFETCH_API_SECRET;

if(nodeEnv === 'test') {
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
  organizationId: process.env.OPBEAT_ORGANIZATION_ID,
  appId: process.env.OPBEAT_APP_ID,
  secretToken: process.env.OPBEAT_SECRET_TOKEN,
  silent: true,
};

// Exports configuration
module.exports = {
  env: nodeEnv,
  port: port,

  mongoUrl: process.env.MONGO_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/' + nodeEnv,

  appId: apiId,
  appSecret: apiSecret,

  companionUrl: process.env.COMPANION_URL || 'http://localhost:' + port,
  managerUrl: managerUrl,
  apiUrl: apiUrl,

  doneEndpoint: process.env.DONE_ENDPOINT || 'https://localhost/done/',

  services: services
};
