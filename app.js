'use strict';
/**
 * @file Configure the application.
 */

var restify = require('restify');
var mongoose = require('mongoose');

var config = require('./config/configuration.js');

mongoose.connect(config.mongoUrl);

var lib = require('./lib/');
var handlers = lib.handlers;
var middlewares = lib.middlewares;

var server = restify.createServer();


server.use(middlewares.logger);
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.authorizationParser());
server.use(middlewares.injectRedirect);

require("./config/routes.js")(server, handlers);

module.exports = server;

