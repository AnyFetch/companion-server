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
        .expect(/token does not match any registered account/i)
        .end(done);
    });
    it("should refuse access if query is missing", function(done) {
      request(app)
        .get('/documents')
        .set('Authorization', 'Bearer ' + MOCK_SERVER_TOKEN)
        .expect(409)
        .expect(/missing query parameter/i)
        .end(done);
    });
    it("should accept queries and return results", function(done) {
      async.waterfall([
        function queryDocuments(cb) {
          request(app)
            .get('/documents?query=test')
            .set('Authorization', 'Bearer ' + MOCK_SERVER_TOKEN)
            .expect(200)
            .end(cb);
        },
        function assert(res, cb) {
          res.body.should.have.property('length', 1);
          res.body[0].should.have.property('type', 'file');
          res.body[0].should.have.property('id', '53ce3726f341e34e309ef0bb');
          res.body[0].should.have.property('date', '2014-07-22T10:04:22.441Z');
          cb();
        }
      ], done);
    });
    it("should pre-project snippets and title", function(done) {
      async.waterfall([
        function queryDocuments(cb) {
          request(app)
            .get('/documents?query=test')
            .set('Authorization', 'Bearer ' + MOCK_SERVER_TOKEN)
            .expect(200)
            .end(cb);
        },
        function assert(res, cb) {
          res.body[0].should.have.property('snippet', "<h1>My Document</h1><code>mydoc.doc</code>");
          res.body[0].should.have.property('title', "My Document");
          cb();
        }
      ], done);
    });
  });

  describe("GET /documents/:id", function() {
    it("should refuse access if token is missing", function(done) {
      request(app)
        .get('/documents/5252ce4ce4cfcd16f55cfa3b')
        .expect(403)
        .expect(/token does not match any registered account/i)
        .end(done);
    });
    it("should accept access if everything's right", function(done) {
      async.waterfall([
        function queryDocuments(cb) {
          request(app)
            .get('/documents/53ce3726f341e34e309ef0bb')
            .set('Authorization', 'Bearer ' + MOCK_SERVER_TOKEN)
            .expect(200)
            .end(cb);
        },
        function assert(res, cb) {
          res.body.should.have.property('type', "file");
          res.body.should.have.property('id', "53ce3726f341e34e309ef0bb");
          res.body.should.have.property('date', '2014-07-22T10:04:22.441Z');
          cb();
        }
      ], done);
    });
    it("should pre-project full and title", function(done) {
      async.waterfall([
        function queryDocuments(cb) {
          request(app)
            .get('/documents/5252ce4ce4cfcd16f55cfa3b')
            .set('Authorization', 'Bearer ' + MOCK_SERVER_TOKEN)
            .expect(200)
            .end(cb);
        },
        function assert(res, cb) {
          res.body.should.have.property('full', "<h1>My Document</h1><p><code>mydoc.doc</code></p>");
          res.body.should.have.property('title', "My Document");
          cb();
        }
      ], done);
    });
  });
});
