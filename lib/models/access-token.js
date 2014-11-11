"use strict";

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  token: {
    type: String,
    index: true,
    required: true
  },
  companyId: {
    type: ObjectId,
    required: true
  },
  userId: {
    type: ObjectId,
    required: true
  },
  userEmail: {
    type: String,
  }
});

module.exports = mongoose.model('AccessToken', schema);
