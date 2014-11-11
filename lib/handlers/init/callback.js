"use strict";

var restify = require('restify');
var async = require('async');
var rarity = require('rarity');
var Anyfetch = require('anyfetch');
var mongoose = require('mongoose');
var AccessToken = mongoose.model('AccessToken');

var config = require('../../../config/configuration.js');

module.exports.get = function get(req, res, next) {
  async.waterfall([
    function fetchToken(cb) {
      if(!req.query.code) {
        return cb(new restify.ForbiddenError("code parameter is not defined"));
      }
      Anyfetch.getAccessToken(config.appId, config.appSecret, req.query.code, cb);
    },
    function fetchInfos(token, cb) {
      var accessToken = new AccessToken({
        token: token
      });

      var anyfetchClient = new Anyfetch(token);
      anyfetchClient.getUser(rarity.carry([anyfetchClient, accessToken], cb));
    },
    function saveUserInfo(anyfetchClient, accessToken, res, cb) {
      var userId = res.body.id;
      var userEmail = res.body.email;
      accessToken.userId = userId;
      accessToken.userEmail = userEmail;

      anyfetchClient.getCompany(rarity.carry([accessToken], cb));
    },
    function saveCompanyInfo(accessToken, res, cb) {
      accessToken.companyId = res.body.id;

      accessToken.save(cb);
    },
    function showToken(saved, affected, cb) {
      res.redirect(config.doneEndpoint + saved.token);
      cb();
    }
  ], next);
};
