"use strict";

var async = require('async');
var rarity = require('rarity');
var Anyfetch = require('anyfetch');
var mongoose = require('mongoose');
var AccessToken = mongoose.model('AccessToken');

module.exports.get = function createGet(config) {
  return function get(req, res, next) {
    async.waterfall([
      function fetchToken(cb) {
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
        var toSave = new AccessToken({
          token: token,
          company: companyId,
          user: userId
        });
        toSave.save(rarity.carry([token], cb));
      },
      function showToken(token, saved, affected, cb) {
        res.redirect("https://localhost/done/" + token);
        cb();
      }
    ], next);
  };
};
