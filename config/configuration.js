'use strict';

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

var mUrl = process.env.MANAGER_URL || 'https://manager.anyfetch.com';
var aUrl = process.env.API_URL || 'https://api.anyfetch.com';

if(node_env === 'test') {
  mUrl = 'http://localhost:8001';
  aUrl = 'http://localhost:8002';
}

// Exports configuration
module.exports = {
  env: node_env,
  port: port,

  mongoUrl: process.env.MONGO_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/' + node_env,

  appId: process.env.ANYFETCH_API_ID,
  appSecret: process.env.ANYFETCH_API_SECRET,

  companionUrl: process.env.COMPANION_URL || 'http://localhost:' + port,
  managerUrl: mUrl,
  apiUrl: aUrl
};
