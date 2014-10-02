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
      var anyfetchClient = new Anyfetch(token);
      anyfetchClient.batch({
          '/': null,
          '/company': null
        },
        rarity.carry([token], cb)
      );
    },
    function saveToken(token, infos, cb) {
      // TODO: Reach the user id differently (ie. update anyfetch.js)
      var userId = infos.body['/'].current_user_url.split('/')[2];
      var companyId = infos.body['/company'].id;
      var accessToken = new AccessToken({
        token: token,
        companyId: companyId,
        userId: userId
      });
      accessToken.save(rarity.carry([token], cb));
    },
    function showToken(token, saved, affected, cb) {
      res.redirect(config.doneEndpoint + token);
      cb();
    }
  ], next);
};
