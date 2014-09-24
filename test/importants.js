"use strict";

var should = require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require ('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var app = require('../app.js');
var helpers = require('./helpers.js');
var ImportantDocument = mongoose.model("ImportantDocument");

function createFakeImportantDocument(done) {
  request(app)
    .post('/events/test/importants/53ce3726f341e34e309ef0bb?context=test')
    .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
    .expect(202)
    .end(done);
}

function deleteImportantDocument(cb) {
  request(app)
    .del('/events/test/importants/53ce3726f341e34e309ef0bb')
    .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
    .expect(202)
    .end(cb);
}


describe("Important documents endpoint", function() {
  beforeEach(helpers.createFakeToken);

  describe("GET /events/:eventId/importants", function() {
    beforeEach(createFakeImportantDocument);

    it("should refuse access if token is missing", helpers.checkForAuth('get', '/events/test/importants'));

    it("should accept queries and return results", function(done) {
      request(app)
        .get('/events/test/importants')
        .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
        .expect(200)
        .expect(function assert(res) {
          res.body.should.have.lengthOf(1);
          res.body[0].should.have.property('type', 'file');
          res.body[0].should.have.property('document', '53ce3726f341e34e309ef0bb');
          res.body[0].should.have.property('date', '2014-07-22T10:04:22.441Z');
        })
        .end(done);
    });
  });

  describe("POST /events/:eventId/importants/:id", function() {
    it("should refuse access if token is missing", helpers.checkForAuth('post', '/documents/53ce3726f341e34e309ef0bb?context=test'));

    it("should add successfully in the database the document", function(done) {
      async.waterfall([
        createFakeImportantDocument,
        function queryMongo(res, cb) {
          ImportantDocument.findOne({ document: new ObjectId("53ce3726f341e34e309ef0bb") }, cb);
        },
        function assert(document, cb) {
          document.should.have.property('type', 'file');
          document.should.have.property('document', new ObjectId('53ce3726f341e34e309ef0bb'));
          document.should.have.property('date', '2014-07-22T10:04:22.441Z');
          document.should.have.property('eventId', 'test');
          cb();
        }
      ], done);
    });

    it("should complain if the document is already there", function(done) {
      async.waterfall([
        createFakeImportantDocument,
        function createFakeRedundantImportantDocument(cb) {
          request(app)
            .post('/events/test/importants/53ce3726f341e34e309ef0bb?context=test')
            .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
            .expect(409)
            .expect(/document already marked as important/i)
            .end(cb);
        }
      ], done);
    });
  });

  describe("DELETE /events/:eventId/importants/:id", function() {
    beforeEach(helpers.createFakeToken);

    it("should refuse access if token is missing", helpers.checkForAuth('delete', '/documents/53ce3726f341e34e309ef0bb'));

    it("should delete successfully the document from the database", function(done) {
      async.waterfall([
        deleteImportantDocument,
        function queryMongo(res, cb) {
          ImportantDocument.findOne({ document: new ObjectId("53ce3726f341e34e309ef0bb") }, cb);
        },
        function assert(document, cb) {
          should(document).not.have.property('_id');
          cb();
        }
      ], done);
    });

    it("should complain if the document is not important yet", function(done) {
      async.waterfall([
        deleteImportantDocument,
        function createFakeRedundantImportantDocument(cb) {
          request(app)
            .del('/events/test/importants/53ce3726f341e34e309ef0bb')
            .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
            .expect(409)
            .expect(/this document is not important/i)
            .end(cb);
        }
      ], done);
    });
  });

});
