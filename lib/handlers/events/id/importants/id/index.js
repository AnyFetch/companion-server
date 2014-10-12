"use strict";

var async = require('async');
var Anyfetch = require('anyfetch');
var mongoose = require('mongoose');
var rarity = require('rarity');
var restify = require('restify');
var ObjectId = mongoose.Types.ObjectId;

var ImportantDocument = mongoose.model('ImportantDocument');

module.exports.post = function post(req, res, next) {
  var anyfetchClient = new Anyfetch(req.accessToken.token);
  async.waterfall([
    function checkForExisting(cb) {
      ImportantDocument.findOne({eventId: req.params.eventId, documentId: new ObjectId(req.params.id)}, cb);
    },
    function getDocumentFull(existing, cb) {
      if(existing) {
        return cb(new restify.ConflictError("Document already marked as important"));
      }
      anyfetchClient.getDocumentById(req.params.id, { search: req.query.context, render_templates: true }, cb);
    },
    function getDocumentSnippet(fullRes, cb) {
      anyfetchClient.getDocuments({ search: req.query.context || "", id: req.params.id, render_templates: true }, rarity.carry([fullRes], cb));
    },
    function saveImportantDocument(fullRes, snippetRes, cb) {
      var document = fullRes.body;
      if(!snippetRes.body.data[0]) {
        return cb(new restify.InternalError("Document does not exist anymore or has been updated"));
      }
      var importantDocument = new ImportantDocument({
        type: document.document_type.name,
        provider: document.provider.client.name,
        date: new Date(document.modification_date),
        documentId: new ObjectId(req.params.id),
        companyId: req.accessToken.companyId,
        eventId: req.params.eventId,
        title: document.rendered_title,
        full: document.rendered_full,
        snippet: snippetRes.body.data[0].rendered_snippet
      });
      importantDocument.save(cb);
    },
    function confirmSave(doc, affected, cb) {
      res.send(204);
      cb();
    }
  ], next);
};

module.exports.del = function del(req, res, next) {
  async.waterfall([
    function queryDocument(cb) {
      ImportantDocument.findOne({ eventId: req.params.eventId, companyId: req.accessToken.companyId, documentId: new ObjectId(req.params.id) }, cb);
    },
    function startDeletion(doc, cb) {
      if(!doc) {
        return cb(new restify.ConflictError("This document is not important"));
      }
      doc.remove(cb);
    },
    function writeRes(doc, cb) {
      res.send(204);
      cb();
    }
  ], next);
};
