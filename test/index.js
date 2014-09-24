"use strict";

var Anyfetch = require('anyfetch');
var restify = require ('restify');

var config = require('../config/configuration.js');

var clearDB = require('mocha-mongoose')(config.mongoUrl);

var MOCK_SERVER_TOKEN = "0d7d5dd28e615b2d31cf648df4a5a279e509945b";

before(function setupServers() {
  var apiServer = Anyfetch.createMockServer();
  apiServer.override("get", "/documents", {
    "facets": {
      "document_types": [
        {
          "_type": "DocumentType",
          "id": "5252ce4ce4cfcd16f55cfa3b",
          "name": "file",
          "templates": {
            "snippet": "<article>\n  <h1>{{{ title }}}</h1>\n  <code>{{{ path }}}</code>\n</article>\n",
            "full": "<article>\n  <h1>{{{ title }}}</h1>\n  <code>{{{ path }}}</code>\n</article>\n",
            "title": "{{ title }}"
          },
          "description": "Most basic document type for any kind of binary content. When a provider sends data without any additional information, it will use this document_type.",
          "projections": {
            "snippet": [
              "title",
              "path",
              "extension"
            ],
            "full": [
              "title",
              "path",
              "extension"
            ]
          },
          "document_count": 1
        }
      ],
      "providers": [
        {
          "_type": "AccessToken",
          "id": "53c66af5d3bda13f3a848ab9",
          "client": null,
          "is_basic_token": true,
          "account_name": "",
          "document_count": 1
        }
      ],
      "creation_dates": [
        {
          "_type": "Date",
          "timestamp": "1404172800000",
          "date": "Tue Jul 01 2014 02:00:00 GMT+0200 (CEST)",
          "document_count": 1
        }
      ]
    },
    "data": [
      {
        "_type": "Document",
        "id": "53ce3726f341e34e309ef0bb",
        "identifier": "the_unique_identifier",
        "creation_date": "2014-07-22T10:04:22.441Z",
        "provider": {
          "_type": "AccessToken",
          "id": "53c66af5d3bda13f3a848ab9",
          "client": null,
          "is_basic_token": true,
          "account_name": ""
        },
        "company": "52f0bb24c8318c2d65000035",
        "document_type": {
          "_type": "DocumentType",
          "id": "5252ce4ce4cfcd16f55cfa3b",
          "name": "file",
          "templates": {
            "snippet": "<h1>{{{ title }}}</h1><code>{{{ path }}}</code>",
            "title": "{{{ title }}}"
          }
        },
        "actions": {},
        "document_url": "/documents/53ce3726f341e34e309ef0bb",
        "projection_type": "snippet",
        "data": {
          "title": "My Document",
          "path": "mydoc.doc"
        },
        "related_count": 0,
        "score": 1
      }
    ],
    "count": 1,
    "max_score": 1
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

beforeEach(clearDB);
