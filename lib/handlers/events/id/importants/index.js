"use strict";

var async = require('async');
var mongoose = require('mongoose');

var ImportantDocument = mongoose.model('ImportantDocument');

module.exports.get = function get(req, res, next) {
  async.waterfall([
    function queryDocuments(cb) {
      ImportantDocument.find({ eventId: req.params.eventId, companyId: req.accessToken.companyId }, null, { $orderby: { date: -1 } }, cb);
    },
    function writeRes(documents, cb) {
      res.send(documents);
      cb();
    }
  ], next);
};
