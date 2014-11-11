"use strict";
/**
 * @file Defines the routes available on the server

 * Will define all availables exposed HTTP paths, and their methods (GET / POST / ...).
 */
var lib = require('../lib/');
var handlers = lib.handlers;
var middlewares = lib.middlewares;

// Routes client requests to handlers
module.exports = function(server) {
  server.get('/init/connect', handlers.init.connect.get);
  server.get('/init/callback', handlers.init.callback.get);

  server.get('/start', middlewares.auth, handlers.start.index.get);

  server.get('/documents', middlewares.auth, handlers.documents.index.get);
  server.get('/documents/:id', middlewares.auth, handlers.documents.id.index.get);

  server.get('/events/:eventId/importants', middlewares.auth, handlers.events.id.importants.index.get);
  server.post('/events/:eventId/importants/:id', middlewares.auth, middlewares.checkObjectId(), handlers.events.id.importants.id.index.post);
  server.del('/events/:eventId/importants/:id', middlewares.auth, middlewares.checkObjectId(), handlers.events.id.importants.id.index.del);
};
