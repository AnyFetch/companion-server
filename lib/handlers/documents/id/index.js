"use strict";

var async = require('async');
var Anyfetch = require('anyfetch');
var mustache = require('mustache');

module.exports.get = function get(req, res, next) {
  async.waterfall([
    function getDocument(cb) {
      var anyfetchClient = new Anyfetch(req.accessToken.token);
      anyfetchClient.getDocumentById(req.params.id, cb);
    },
    function mapDocument(documentRes, cb) {
      var document = documentRes.body;
      var templates = document.document_type.templates;
      res.send(200, {
        type: document.document_type.name,
        id: document.id,
        date: document.modification_date,
        full: mustache.render(templates.full, document.data),
        title: mustache.render(templates.title, document.data)
      });
      cb();
    }
  ], next);
};
