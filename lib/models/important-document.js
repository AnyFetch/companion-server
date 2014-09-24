"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  type: { type: String, required: true },
  document: { type: ObjectId, indexed: true, required: true },
  date: { type: String, required: true },
  eventId: { type: String, required: true },
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  full: { type: String, required: true }
});

module.exports = mongoose.model('ImportantDocument', schema);
