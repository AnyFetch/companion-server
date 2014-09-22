var autoload = require ('auto-load');

module.exports = {
  models: autoload(__dirname + '/models'),
  handlers: autoload(__dirname + '/handlers'),
  middleware: autoload(__dirname + '/middleware')
};

