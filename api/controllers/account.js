'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');
var util = require('util');
const {
    Keypair,StrKey
} = require('stellar-base');

module.exports = {
    createAccount: createAccount
};


function createAccount(req, res) {
    const redis = req.app.redis;
    //redis.getOneHash('list1',"a").then(value => {console.log('123213');console.log(value);});;
    var x = {a: "1"};
    //insertHash
    redis.getOneHash('list1',"a3").then(value => {
        res.json(value);
    }).catch(err => {
        console.log(err);
    });

    //console.log(rs);
    // var body = req.swagger.params.body;
    // var publicKey = body.value.publicKey;
    // if (!StrKey.isValidEd25519PublicKey(publicKey)) {
    //     res.json({result: {code: 1, log: 'invalid public key'}});
    //     return;
    // }
    // console.log(publicKey);
    // let tx = {
    //     version: 1,
    //     account: configKey.MY_PUBLIC_KEY,
    //     sequence: 5,
    //     memo: Buffer.alloc(0),
    //     operation: 'create_account',
    //     params: {
    //         address: publicKey
    //     },
    //     signature: Buffer.alloc(64, 0),

    // }
    // trans.sign(tx, configKey.MY_PRIVATE_KEY);
    // var hashTx = trans.encode(tx).toString('hex');
    // console.log(hashTx);
    // axios.get('https://zebra.forest.network/broadcast_tx_sync?tx=0x'+hashTx)
    //     .then(function (response) {
    //         res.json(response.data);
    //     })
    //     .catch(function (error) {
    //         res.json(error);
    //     }); 
}