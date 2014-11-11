"use strict";

var restify = require('restify');

module.exports = function checkObjectIdGenerator(param) {
  return function checkObjectId(req, res, next) {
    if(!req.params[param || 'id'].match(/^[0-9a-fA-F]{24}$/)) {
      return next(new restify.NotFoundError("Invalid ObjectId"));
    }
    next(null);
  };
};
