"use strict";

var async = require('async');
var request = require('supertest');

var app = require('../app.js');

var MOCK_SERVER_TOKEN = "0d7d5dd28e615b2d31cf648df4a5a279e509945b";

describe("Documents endpoint", function() {
  beforeEach(function createTokenInMongo(done) {
    request(app)
      .get('/init/callback?code=test')
      .expect(302)
      .end(done);
  });

  describe("GET /documents", function() {
    it("should refuse access if token is missing", function(done) {
      request(app)
        .get('/documents?query=test')
        .expect(403)
        .end(done);
    });
    it("should refuse access if query is missing", function(done) {
      request(app)
        .get('/documents')
        .set('Authentication', 'Bearer ' + MOCK_SERVER_TOKEN)
        .expect(409)
        .end(done);
    });
    it("should accept queries and return results", function(done) {
      async.waterfall([
        function queryDocuments(cb) {
          request(app)
            .get('/documents?query=test')
            .set('Authentication', 'Bearer ' + MOCK_SERVER_TOKEN)
            .expect(200)
            .end(cb);
        },
        function assert(res, cb) {
          res.body.should.have.property('length', 1);
          res.body[0].should.have.propery('type', 'file');
          cb();
        }
      ], done);
    });
    it("should pre-project snippets and title", function(done) {
      async.waterfall([
        function queryDocuments(cb) {
          request(app)
            .get('/documents?query=test')
            .set('Authentication', 'Bearer ' + MOCK_SERVER_TOKEN)
            .expect(200)
            .end(cb);
        },
        function assert(res, cb) {
          res.body[0].should.have.property('snippet', "<h1>My Document</h1>");
          res.body[0].should.have.property('title', "My Document");
          cb();
        }
      ], done);
    });
  });

  describe("GET /documents/:id", function() {
    it("should refuse access if token is missing");
    it("should refuse access if the document doesn't exist");
    it("should refuse access without the right permissions");
    it("should accept access with the right permissions");
    it("should accept access if the document has been shared");
    it("should pre-project full and title");
  });
});
