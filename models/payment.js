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

class Payment {
    constructor(redis) {
        this.redis = redis;
    }

    payment(transaction) {
        return Transaction.commit(transaction);
    }

    paymentHistoryByPublicKey(publicKey) {
        return new Promise((resolve, reject) => {
            if (!StrKey.isValidEd25519PublicKey(publicKey)) {
                reject({ statusCode: -1, message: 'invalid public key'});
            }
        
            paymentRepo.getAllByPublicKey(this.redis, publicKey).then(payment => {
                resolve( { statusCode: 1, message: '', value: {payments: payment} });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
    }

    paymentHistory() {
        return new Promise((resolve, reject) => {
            paymentRepo.getAll(this.redis).then(payment => {
                resolve( { statusCode: 1, message: '', value: {payments: payment} });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
    }
}

module.exports = Payment;