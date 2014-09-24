"use strict";

var mongoose = require('mongoose');
var async = require('async');
var restify = require('restify');

var AccessToken = mongoose.model('AccessToken');

module.exports = function auth(req, res, next) {
  if(!req.authorization && req.authorization.scheme !== "Bearer") {
    return next(new restify.ForbiddenError());
  }
  async.waterfall([
    function fetchToken(cb) {
      AccessToken.findOne({ token: req.authorization.credentials }, cb);
    },
    function registerToken(token, cb) {
      if(!token) {
        return cb(new restify.ForbiddenError());
      }
      req.accessToken = token;
      cb();
    }
  ], next);
};
