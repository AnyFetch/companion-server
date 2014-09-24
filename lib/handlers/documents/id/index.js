"use strict";

var async = require('async');
var Anyfetch = require('anyfetch');

module.exports.get = function get(req, res, next) {
  async.waterfall([
    function getDocument(cb) {
      var anyfetchClient = new Anyfetch(req.accessToken.token);
      anyfetchClient.getDocumentById(req.params.id, { search: req.query.context }, cb);
    },
    function mapDocument(documentRes, cb) {
      var document = documentRes.body;
      res.send(200, {
        type: document.document_type.name,
        id: document.id,
        date: document.modification_date,
        full: document.rendered_full,
        title: document.rendered_title
      });
      cb();
    }
  ], next);
};
