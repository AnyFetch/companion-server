'use strict';

/**
 * @file Load and init external services
 */

var config = require('../config/configuration.js');

/* istanbul ignore next */
if(config.services.opbeat.secretToken) {
  var opbeat = require('opbeat');
  module.exports.opbeat = opbeat(config.services.opbeat);
}
else {
  module.exports.opbeat = null;
}
