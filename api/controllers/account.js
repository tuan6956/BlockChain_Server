'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');
var util = require('util');
const {
    Keypair,StrKey
} = require('stellar-base');
const helper = require('../../helper')
module.exports = {
    signUp: signUp
};

function signIn(req, res) {
    var body = req.swagger.params.body;
    var publicKey = body.value.publicKey;
    var signature = body.value.signature;
    
    if (!StrKey.isValidEd25519PublicKey(publicKey)) {
        res.json({result: {code: 1, log: 'invalid public key'}});
        return;
    }

}
function signUp(req, res) {

    // helper.checkTransaction(null, '0130c0888a5fdc63d5a6f60691182d181d68a3727889abab19f197d690e2eeade33da5c200000000000000100002002b305b98372b6f1262eda14f97dac825e1b531df7bfcfa54a62bccf500097f64ad3a188000000000000000019d70b5d3fbeedb859116e7f68e8158f60c0e10ed4701486e112e9c592531f97023f4407adcb9caca29b912d3be130445a48c36bcdd45442d8c3ed738f6ca7204', null)
    // .then(value => res.json({value: value}))
    // .catch(err => res.json({message: '123'}));
     const redis = req.app.redis;

    //redis.getOneHash('list1',"a").then(value => {console.log('123213');console.log(value);});;
    //insertHash
    var c = {
        account: '123123',
        publickey: '123123',
        react: [
            {a: 1},
            {b: 3}
        ]
    }    
    // redis.getList('list_1').then(value => {
    //     console.log(value);
    //     res.json({value: {payments: value}});
    // })
    // redis.insertList("list_1", c);
    // redis.insertList("list_1", c);
    // redis.insertList("list_1", c);
    // res.json('OK');    
    

    // // redis.insertHash('list1', 'a3', c).then(value => {
    // //     res.json(value);
    // // }).catch(err => {
    // //     console.log(err);
    // // });

    redis.getAllHash('list1').then(value => {
        // var xx = Object.keys(value).map((key) => {return (value[key])});
         console.log(value);
        res.json({value: {value: value}});
    }).catch(err => {
        console.log(err);
    });
    // redis.getOneHash('list1','a2').then(value => {
    //     res.json(value);
    // }).catch(err => {
    //     console.log(err);
    // });

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
function profile(req, res) {

}
function update(req, res) {
    
}
function update(req, res) {
    
}
function getFollow(req, res) {
    
}
function follow(req, res) {
    
}