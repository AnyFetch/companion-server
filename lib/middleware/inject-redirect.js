"use strict";

module.exports = function injectRedirect(req, res, next) {
  res.redirect = function redirect(addr) {
    res.header('Location', addr);
    res.send(302);
  };
  next();
};
