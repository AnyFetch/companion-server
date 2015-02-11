"use strict";
var Anyfetch = require('anyfetch');

module.exports.get = function get(req, res, next) {
  var anyfetchClient = new Anyfetch(req.accessToken.token);
  anyfetchClient.getDocuments({
    fields: 'facets.providers',
    limit: 0 // We don't want to retrieve any documents
  }, function updated(err, anyfetchRes) {
    if(!err) {
      var providers = anyfetchRes.body.facets.providers;
      res.send({
        count: providers ? providers.length : 0
      });
    }
    next(err);
  });
};
