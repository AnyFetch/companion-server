'use strict';
/**
 * @file Configure the application.
 */

var restify = require('restify');
var mongoose = require('mongoose');
var autoload = require ('auto-load');

var config = require('./config/configuration.js');

mongoose.connect(config.mongoUrl);

var lib = require('./lib/');
var handlers = lib.handlers;
var middleware = lib.middleware;

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.authorizationParser());

require("./config/routes.js")(server, handlers);

module.exports = server;

