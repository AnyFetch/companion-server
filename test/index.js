"use strict";

var Anyfetch = require('anyfetch');
var restify = require ('restify');

var MOCK_SERVER_TOKEN = "0d7d5dd28e615b2d31cf648df4a5a279e509945b";

before(function setupServers() {
  var apiServer = Anyfetch.createMockServer();
  apiServer.listen(8002);

  var managerServer = restify.createServer();
  managerServer.post('/oauth/access_token', function getAccessToken(req, res, next) {
    res.send(200, {
      token_type: 'bearer',
      access_token: MOCK_SERVER_TOKEN
    });
    next();
  });
  managerServer.listen(8001);
});
