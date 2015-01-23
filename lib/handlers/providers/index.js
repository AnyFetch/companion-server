"use strict";
var Anyfetch = require('anyfetch');

module.exports.get = function get(req, res, next) {
  var anyfetchClient = new Anyfetch(req.accessToken.token);
  anyfetchClient.getDocuments({
    fields: 'facets.provider'
  }, function updated(err, res) {
    if(!err) {
      var providers = res.body.facets.providers;
      res.send({
        'count': providers.length
      });
    }
    next(err);
  });
};
