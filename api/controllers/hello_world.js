'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');

var util = require('util');
const {
    Keypair
} = require('stellar-base');



module.exports = {
  hello: hello
};

function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = req.swagger.params.name.value || 'stranger';
  var hello = util.format('Hello, %s!', name);
  // var body = req.swagger.params.body;
  // var publicKey = body.value.publicKey;
  var key = Keypair.random();
  var publicKey = key.publicKey();
  let tx = {
    version: 1,
    account: configKey.MY_PUBLIC_KEY,
    sequence: 14,
    memo: Buffer.alloc(0),
    operation: 'create_account',
    params: {
      address: publicKey
    },
    signature: Buffer.alloc(64, 0),

  }
  trans.sign(tx, configKey.MY_PRIVATE_KEY);
  var hashTx = trans.encode(tx).toString('hex');
  console.log(hashTx);
  axios.get('https://zebra.forest.network/broadcast_tx_sync?tx=0x' + hashTx)
    .then(function (response) {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      res.json(error);
    });
  // this sends back a JSON response which is a single string
}