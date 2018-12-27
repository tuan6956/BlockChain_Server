'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var Redisson = require('./database/redis')
var Block = require('./models/block')
var accountModel = require('./models/account');
var paymentModel = require('./models/payment');
var tweetModel = require('./models/tweet');
var transactionModel = require('./models/transaction');

const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};
app.redis = new Redisson();
app.redis.connect('103.114.107.16');

var block = new Block(app.redis);
app.account = new accountModel(app.redis);
app.payment = new paymentModel(app.redis);
app.tweet = new tweetModel(app.redis);
app.transaction = new transactionModel(app.redis);

block.init();

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8008;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
