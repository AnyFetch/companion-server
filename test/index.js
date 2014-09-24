"use strict";

var Anyfetch = require('anyfetch');
var restify = require ('restify');

var config = require('../config/configuration.js');

var clearDB = require('mocha-mongoose')(config.mongoUrl);

var MOCK_SERVER_TOKEN = "0d7d5dd28e615b2d31cf648df4a5a279e509945b";

before(function setupServers() {
  var apiServer = Anyfetch.createMockServer();
  apiServer.override("get", "/documents", {
    "facets": {},
    "data": [
      {
        "_type": "Document",
        "id": "53ce3726f341e34e309ef0bb",
        "identifier": "the_unique_identifier",
        "creation_date": "2014-07-22T10:04:22.441Z",
        "modification_date": "2014-07-22T10:04:22.441Z",
        "provider": {},
        "company": "52f0bb24c8318c2d65000035",
        "document_type": {
          "_type": "DocumentType",
          "id": "5252ce4ce4cfcd16f55cfa3b",
          "name": "file",
          "templates": {
            "snippet": "<h1>{{{ title }}}</h1><code>{{{ path }}}</code>",
            "title": "{{ title }}"
          }
        },
        "actions": {},
        "document_url": "/documents/53ce3726f341e34e309ef0bb",
        "projection_type": "snippet",
        "data": {
          "title": "My Document",
          "path": "mydoc.doc"
        },
        "rendered_snippet": "<h1>My Document</h1><code>mydoc.doc</code>",
        "rendered_title": "My Document",
        "related_count": 0,
        "score": 1
      }
    ],
    "count": 1,
    "max_score": 1
  });
  apiServer.override("get", "/documents/:id", {
    "_type": "Document",
    "id": "53ce3726f341e34e309ef0bb",
    "identifier": "the_unique_identifier",
    "creation_date": "2014-07-22T10:04:22.441Z",
    "modification_date": "2014-07-22T10:04:22.441Z",
    "provider": {},
    "company": "52f0bb24c8318c2d65000035",
    "document_type": {
      "_type": "DocumentType",
      "id": "5252ce4ce4cfcd16f55cfa3b",
      "name": "file",
      "templates": {
        "full": "<h1>{{{ title }}}</h1><p><code>{{{ path }}}</code></p>",
        "title": "{{ title }}"
      }
    },
    "actions": {},
    "document_url": "/documents/53ce3726f341e34e309ef0bb",
    "projection_type": "snippet",
    "data": {
      "title": "My Document",
      "path": "mydoc.doc"
    },
    "rendered_full": "<h1>My Document</h1><p><code>mydoc.doc</code></p>",
    "rendered_title": "My Document",
    "related_count": 0,
    "score": 1
  });
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

afterEach(clearDB);
