"use strict";
/**
 * @file Defines the routes available on the server

 * Will define all availables exposed HTTP paths, and their methods (GET / POST / ...).
 */
var lib = require('../lib/');
var handlers = lib.handlers;
var middleware = lib.middleware;

// Routes client requests to handlers
module.exports = function(server) {
  server.get('/init/connect', handlers.init.connect.get);
  server.get('/init/callback', handlers.init.callback.get);

  server.get('/documents', middleware.auth, handlers.documents.index.get);
  server.get('/documents/:id', middleware.auth, handlers.documents.id.index.get);
};
