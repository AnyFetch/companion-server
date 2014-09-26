"use strict";

var request = require('supertest');
var app = require('../app.js');

// https://github.com/AnyFetch/anyfetch.js/tree/master/lib/test-server/mocks
module.exports.MOCK_SERVER_TOKEN = "0d7d5dd28e615b2d31cf648df4a5a279e509945b";
module.exports.MOCK_SERVER_COMPANY_ID = "52f0bb24c8318c2d65000035";
module.exports.MOCK_SERVER_USER_ID = "52f0bb24c8318c2d65000036";
module.exports.MOCK_SERVER_DOC_ID =  "53ce3726f341e34e309ef0bb";

module.exports.createFakeToken = function createFakeToken(done) {
  request(app)
    .get('/init/callback?code=test')
    .expect(302)
    .end(done);
};

module.exports.checkForAuth = function checkForAuthGenerator(verb, path) {
  return function checkForAuth(done) {
    request(app)
      [verb](path)
      .expect(403)
      .expect(/token does not match any registered account/i)
      .end(done);
  };
};
