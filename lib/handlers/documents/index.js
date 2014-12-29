"use strict";

var restify = require('restify');
var async = require('async');
var Anyfetch = require('anyfetch');


module.exports.get = function get(req, res, next) {
  if(!req.query.context) {
    return next(new restify.ConflictError("Missing query parameter"));
  }
  async.waterfall([
    function getDocuments(cb) {
      var anyfetchClient = new Anyfetch(req.accessToken.token);
      anyfetchClient.getDocuments({
        search: req.query.context,
        render_templates: true,
        sort: "-modificationDate"
      }, cb);
    },
    function remapDocuments(documentsRes, cb) {
      var documents = documentsRes.body.data.map(function mapDocuments(document) {
        return {
          type: document.document_type.name,
          provider: document.provider.client.name,
          documentId: document.id,
          date: document.modification_date,
          snippet: document.rendered_snippet,
          title: document.rendered_title
        };
      });
      console.log(JSON.stringify(documents, null, 2));
      res.send(200, documents);
      cb();
    }
  ], next);
};
