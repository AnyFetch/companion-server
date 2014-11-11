"use strict";

var mongoose = require('mongoose');
var async = require('async');
var restify = require('restify');

var AccessToken = mongoose.model('AccessToken');

module.exports = function auth(req, res, next) {
  var token = req.query.access_token;
  if(!token && !req.authorization && req.authorization.scheme !== "Bearer") {
    return next(new restify.ForbiddenError());
  } else {
    token = req.authorization.credentials;
  }
  async.waterfall([
    function fetchToken(cb) {
      AccessToken.findOne({ token: token }, cb);
    },
    function registerToken(token, cb) {
      if(!token) {
        return cb(new restify.ForbiddenError("Token does not match any registered account, please authenticate your account before."));
      }
      req.accessToken = token;
      cb();
    }
  ], next);
};
