"use strict";

var restify = require('restify');
var async = require('async');
var Anyfetch = require('anyfetch');
var mustache = require('mustache');


module.exports.get = function get(req, res, next) {
  if(!req.query.query) {
    return next(new restify.ConflictError());
  }
  async.waterfall([
    function getDocuments(cb) {
      var anyfetchClient = new Anyfetch(req.accessToken.token);
      anyfetchClient.getDocuments({ search: req.query.query }, cb);
    },
    function remapDocuments(documentsRes, cb) {
      res.send(200, documentsRes.body.data.map(function mapDocuments(document) {
        var templates = document.document_type.templates;
        return {
          type: document.document_type.name,
          id: document.id,
          snippet: mustache.render(templates.snippet, document.data),
          title: mustache.render(templates.title, document.data)
        };
      }));
      cb();
    }
  ], next);
};
