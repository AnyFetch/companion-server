"use strict";

module.exports.get = function createGet(config) {
  return function get(req, res, next) {
    res.redirect(config.managerUrl + '/oauth/authorize?client_id=' + config.appId + '&redirect_uri=' + encodeURIComponent(config.companionUrl) + "%2Finit%2Fcallback");
    next();
  };
};
