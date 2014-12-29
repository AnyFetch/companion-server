"use strict";

var config = require('../../../config/configuration.js');

module.exports.get = function get(req, res, next) {
  res.redirect(config.managerUrl + '/oauth/authorize?replace_existing_token=true&approval_prompt=true&client_id=' + config.appId + '&redirect_uri=' + encodeURIComponent(config.companionUrl + "/init/callback"));
  next();
};
