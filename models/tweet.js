'use strict';

var configRedis = require('../config/configRedis');
const { Keypair, StrKey } = require('stellar-base');
const trans = require('../lib/transaction')
const accountRepo = require('../repository/account')
const followRepo = require('../repository/following')
const avatarRepo = require('../repository/avatar')
const tweetRepo = require('../repository/tweet')
const paymentRepo = require('../repository/payment')

const helper = require('../helper')
const Transaction = require('./transaction')
const configBanwidth = require('../config/configBandwidth')

class Tweet {
    constructor(redis) {
        this.redis = redis;
    }

    getTweet(tweetId) {
        return new Promise((resolve, reject) => {
            tweetRepo.getOne(this.redis, tweetId).then(tweet => {
                resolve( { statusCode: 1, message: '', value: tweet });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
            
        return 
    }

    getTweetByPublicKey(publicKey) {
        return new Promise((resolve, reject) => {
            tweetRepo.getAllByPublicKey(this.redis, publicKey).then(tweet => {
                resolve( { statusCode: 1, message: '', value: {tweets: tweet} });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
            
        return 
    }

    postTweet(transaction) {
        return Transaction.commit(transaction);
    }

    interact(transaction) {
        return Transaction.commit(transaction);
    }

    getAll() {
        return new Promise((resolve, reject) => {
            tweetRepo.getAll(this.redis).then(tweet => {
                resolve( { statusCode: 1, message: '', value: {tweets: tweet} });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
            
        return 
    }

}

module.exports = Tweet;