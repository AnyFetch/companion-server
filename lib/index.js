var autoload = require ('auto-load');

module.exports = {
  models: autoload(__dirname + '/models'),
  handlers: autoload(__dirname + '/handlers'),
  middlewares: autoload(__dirname + '/middlewares')
};

