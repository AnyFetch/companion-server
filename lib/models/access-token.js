"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  token: { type: String, index: true, required: true },
  company: { type: ObjectId, required: true },
  user: { type: ObjectId, required: true }
});

module.exports = mongoose.model('AccessToken', schema);
