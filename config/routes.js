
/**
 * @file Defines the routes available on the server

 * Will define all availables exposed HTTP paths, and their methods (GET / POST / ...).
 */
'use strict';
var restify = require('restify');

var config = require('../config/configuration.js');
var lib = require('../lib/');
var handlers = lib.handlers;
var middleware = lib.middleware;

// Routes client requests to handlers
module.exports = function(server) {
};
