"use strict";
var Anyfetch = require('anyfetch');

module.exports.get = function get(req, res, next) {
  var anyfetchClient = new Anyfetch(req.accessToken.token);
  anyfetchClient.postCompanyUpdate(function updated(err) {
    if(!err) {
      res.send(204);
    }
    next(err);
  });
};