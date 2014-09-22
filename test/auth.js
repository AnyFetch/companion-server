'use strict';

var request = require('supertest');
var async = require ('async');
var mongoose = require ('mongoose');
var ObjectId = mongoose.ObjectId;

var app = require('../app.js');
var AccessToken = mongoose.model('AccessToken');

// https://github.com/AnyFetch/anyfetch.js/tree/master/lib/test-server/mocks
var MOCK_SERVER_TOKEN = "0d7d5dd28e615b2d31cf648df4a5a279e509945b";
var MOCK_SERVER_COMPANY_ID = "52f0bb24c8318c2d65000035";
var MOCK_SERVER_USER_ID = "52f0bb24c8318c2d65000036";

describe('Auth handlers', function() {
  describe('GET /init/connect', function() {
    it("should redirect to the AnyFetch grant page", function(done) {
      request(app)
        .get('/init/connect')
        .expect(302)
        .expect('Location', 'http://localhost:8001/oauth/authorize?client_id=test&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Finit%2Fcallback')
        .end(done);
    });
  });

  describe('GET /init/callback', function() {
    it("should redirect to the 'localhost/done' location with the token", function(done) {
      request(app)
        .get('/init/callback?code=test')
        .expect(302)
        .expect('Location', 'https://localhost/done/' + MOCK_SERVER_TOKEN)
        .end(done);
    });

    it("should save the token alongside the user id and the company id", function(done) {
      async.waterfall([
        function requestToken(cb) {
          request(app)
            .get('/init/callback?code=test')
            .expect(302)
            .end(cb);
        },
        function requestMongo(res, cb) {
          AccessToken.findOne({ token: MOCK_SERVER_TOKEN }, cb);
        },
        function assertToken(token, cb) {
          token.should.have.property('company', new ObjectId(MOCK_SERVER_COMPANY_ID));
          token.should.have.property('user', new ObjectId(MOCK_SERVER_USER_ID));
          cb();
        }
      ], done);
    });
  });
});
