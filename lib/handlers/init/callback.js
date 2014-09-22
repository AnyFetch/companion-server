"use strict";

module.exports.get = function createGet(config) {
  return function get(req, res, next) {
    next();
  };
};
