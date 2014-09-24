"use strict";

var request = require('supertest');

var app = require('../app.js');
var helpers = require('./helpers.js');

function createFakeImportantDocument(done) {
  request(app)
    .post('/events/test/importants/53ce3726f341e34e309ef0bb')
    .set('Authorization', 'Bearer ' + helpers.MOCK_SERVER_TOKEN)
    .expect(202)
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
          res.body[0].should.have.property('id', '53ce3726f341e34e309ef0bb');
          res.body[0].should.have.property('date', '2014-07-22T10:04:22.441Z');
        })
        .end(done);
    });
  });
});
