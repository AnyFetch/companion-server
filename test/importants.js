"use strict";

var should = require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require ('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var app = require('../app.js');
var helpers = require('./helpers.js');
var ImportantDocument = mongoose.model("ImportantDocument");
var AccessToken = mongoose.model("AccessToken");

function createFakeImportantDocument(done) {
  request(app)
    .post('/events/test/importants/' + helpers.MOCK_SERVER_DOC_ID + '?context=test')
    .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
    .expect(204)
    .end(done);
}

function deleteImportantDocument(done) {
  request(app)
    .del('/events/test/importants/' + helpers.MOCK_SERVER_DOC_ID)
    .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
    .expect(204)
    .end(done);
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
          res.body[0].should.have.property('documentId', helpers.MOCK_SERVER_DOC_ID);
          res.body[0].should.have.property('date', '2014-07-22T10:04:22.441Z');
        })
        .end(done);
    });

    it("should not find the documents from another company", function(done) {
      async.waterfall([
        function createWrongToken(cb) {
          var accessToken = new AccessToken({
            token: 'wrongCompany',
            companyId: new ObjectId('111111111111111111111111'),
            userId: new ObjectId('111111111111111111111111')
          });
          accessToken.save(cb);
        },
        function tryAccess(accessToken, affected, cb) {
          request(app)
            .get('/events/test/importants')
            .set('Authorization', 'Bearer wrongCompany')
            .expect(200)
            .end(cb);
        },
        function assertEmpty(res, cb) {
          res.body.should.have.lengthOf(0);
          cb();
        }
      ], done);
    });
  });

  describe("POST /events/:eventId/importants/:id", function() {
    it("should refuse access if token is missing", helpers.checkForAuth('post', '/events/test/importants/' + helpers.MOCK_SERVER_DOC_ID + '?context=test'));

    it("should add successfully in the database the document", function(done) {
      async.waterfall([
        createFakeImportantDocument,
        function queryMongo(res, cb) {
          ImportantDocument.findOne({
            documentId: new ObjectId(helpers.MOCK_SERVER_DOC_ID)
          }, cb);
        },
        function assert(document, cb) {
          document.should.have.property('type', 'file');
          document.should.have.property('documentId', new ObjectId(helpers.MOCK_SERVER_DOC_ID));
          document.should.have.property('companyId');
          document.should.have.property('date', new Date('2014-07-22T10:04:22.441Z'));
          document.should.have.property('eventId', 'test');
          document.should.have.property('title', 'My Document');
          document.should.have.property('full', '<h1>My Document</h1><p><code>mydoc.doc</code></p>');
          document.should.have.property('snippet', '<h1>My Document</h1><code>mydoc.doc</code>');
          cb();
        }
      ], done);
    });

    it("should complain if the document is already there", function(done) {
      async.waterfall([
        createFakeImportantDocument,
        function createFakeRedundantImportantDocument(res, cb) {
          request(app)
            .post('/events/test/importants/' + helpers.MOCK_SERVER_DOC_ID + '?context=test')
            .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
            .expect(409)
            .expect(/document already marked as important/i)
            .end(cb);
        }
      ], done);
    });
  });

  describe("DELETE /events/:eventId/importants/:id", function() {
    beforeEach(createFakeImportantDocument);

    it("should refuse access if token is missing", helpers.checkForAuth('delete', '/events/test/importants/' + helpers.MOCK_SERVER_DOC_ID));

    it("should delete successfully the document from the database", function(done) {
      async.waterfall([
        deleteImportantDocument,
        function queryMongo(res, cb) {
          ImportantDocument.findOne({ document: new ObjectId(helpers.MOCK_SERVER_DOC_ID) }, cb);
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
        function createFakeRedundantImportantDocument(res, cb) {
          request(app)
            .del('/events/test/importants/' + helpers.MOCK_SERVER_DOC_ID)
            .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
            .expect(409)
            .expect(/this document is not important/i)
            .end(cb);
        }
      ], done);
    });
  });

});
