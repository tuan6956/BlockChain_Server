'use strict';
const trans = require('../../lib/transaction')
const configKey = require('../../config/Key')
var axios = require('axios');
var util = require('util');
const {
    Keypair,StrKey
} = require('stellar-base');

module.exports = {
    getAll,
    post,
    getOne,
    interact,
    getByPublicKey
    //signUp: signUp
};

function getAll(req, res) {
    req.app.tweet.getAll().then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    })
}
function post(req, res) {
    var body = req.swagger.params.body;
    var txs = body.value.txs;
    req.app.transaction.commit(txs).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    })
}
function getOne(req, res) {
    let tweetId = req.swagger.params.tweetId.value;
    req.app.tweet.getTweet(tweetId).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    }) 
}
function getByPublicKey(req, res) {
    
    let publicKey = req.swagger.params.publicKey.value;
    req.app.tweet.getTweetByPublicKey(publicKey).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    }) 
}
function interact(req, res) {
    var body = req.swagger.params.body;
    var txs = body.value.txs;
    req.app.transaction.commit(txs).then(value => {
        res.status(200);
        res.json(value);
    }).catch(err => {
        res.status(400);
        res.json(err);
    })
}
