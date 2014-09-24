"use strict";

var config = require('../../../config/configuration.js');

module.exports.get = function get(req, res, next) {
  res.redirect(config.managerUrl + '/oauth/authorize?client_id=' + config.appId + '&redirect_uri=' + encodeURIComponent(config.companionUrl + "/init/callback"));
  next();
};
