"use strict";
var Anyfetch = require('anyfetch');

module.exports.get = function get(req, res, next) {
  var anyfetchClient = new Anyfetch(req.accessToken.token);
  anyfetchClient.getDocuments({
    fields: 'facets.providers'
  }, function updated(err, anyfetchRes) {
    if(!err) {
      var providers = anyfetchRes.body.facets.providers;
      res.send({
        'count': providers.length
      });
      console.log({
        'count': providers.length
      });
    }
    next(err);
  });
};
