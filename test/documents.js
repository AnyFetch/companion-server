"use strict";

var request = require('supertest');

var app = require('../app.js');
var helpers = require('./helpers.js');

describe("Documents endpoint", function() {
  beforeEach(helpers.createFakeToken);

  describe("GET /documents", function() {
    it("should refuse access if token is missing", helpers.checkForAuth('get', '/documents'));

    it("should refuse access if query is missing", function(done) {
      request(app)
        .get('/documents')
        .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
        .expect(409)
        .expect(/missing query parameter/i)
        .end(done);
    });

    it("should accept queries and return results", function(done) {
      request(app)
        .get('/documents?query=test')
        .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
        .expect(200)
        .expect(function assert(res) {
          res.body.should.have.lengthOf(1);
          res.body[0].should.have.property('type', 'file');
          res.body[0].should.have.property('id', '53ce3726f341e34e309ef0bb');
          res.body[0].should.have.property('date', '2014-07-22T10:04:22.441Z');
        })
        .end(done);
    });

    it("should pre-project snippets and title", function(done) {
      request(app)
        .get('/documents?query=test')
        .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
        .expect(200)
        .expect(function assert(res) {
          res.body[0].should.have.property('snippet', "<h1>My Document</h1><code>mydoc.doc</code>");
          res.body[0].should.have.property('title', "My Document");
        })
        .end(done);
    });
  });

  describe("GET /documents/:id", function() {
    it("should refuse access if token is missing", helpers.checkForAuth('get', '/documents/53ce3726f341e34e309ef0bb'));

    it("should accept access if everything's right", function(done) {
      request(app)
        .get('/documents/53ce3726f341e34e309ef0bb')
        .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
        .expect(200)
        .expect(function assert(res) {
          res.body.should.have.property('type', "file");
          res.body.should.have.property('id', "53ce3726f341e34e309ef0bb");
          res.body.should.have.property('date', '2014-07-22T10:04:22.441Z');
        })
        .end(done);
    });

    it("should pre-project full and title", function(done) {
      request(app)
        .get('/documents/5252ce4ce4cfcd16f55cfa3b')
        .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
        .expect(200)
        .expect(function assert(res) {
          res.body.should.have.property('full', "<h1>My Document</h1><p><code>mydoc.doc</code></p>");
          res.body.should.have.property('title', "My Document");
        })
        .end(done);
    });
  });
});
