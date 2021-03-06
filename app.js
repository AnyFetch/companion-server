'use strict';
/**
 * @file Configure the application.
 */

var restify = require('restify');
var mongoose = require('mongoose');

var config = require('./config/configuration.js');
var logError = require('./config/services.js').logError;

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

// Log errors
/* istanbul ignore next */
server.on('uncaughtException', function(req, res, route, err) {
  logError(err, req, {
    uncaughtRestifyException: true,
    statusCode: req.statusCode,
  });

  if(!res.headersSent) {
    if(config.env !== "production") {
      res.send(new restify.InternalServerError(err, err.message || 'unexpected error'));
    }
    else {
      res.send(new restify.InternalServerError("An unexpected error occurred :("));
    }

    return true;
  }

  return false;
});

module.exports = server;

