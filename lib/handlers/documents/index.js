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
        sort: "-modificationDate",
        fields: "data",
      }, cb);
    },
    function remapDocuments(documentsRes, cb) {
      res.set("Cache-Control", "max-age=3600");
      res.send(200, documentsRes.body.data.map(function mapDocuments(document) {
        return {
          documentId: document.id,
          typeId: document.document_type.id,
          providerId: document.provider.client.id,
          date: document.modification_date,
          snippet: document.rendered_snippet,
          title: document.rendered_title
        };
      }));
      cb();
    }
  ], next);
};
