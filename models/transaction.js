'use strict';

var configRedis = require('../config/configRedis');
const { Keypair, StrKey } = require('stellar-base');
const trans = require('../lib/transaction')
const accountRepo = require('../repository/account')
const helper = require('../helper')

class Transaction {
    constructor(redis) {
        this.redis = redis;
    }
    commit(transaction) {
        return new Promise((resolve, reject) => {
            helper.checkTransaction(this.redis, transaction).then(value => {
                if (value.statusCode == -1)
                    reject(value);
                else {
                    helper.commitTransaction(transaction).then(commit => {
                        commit.statusCode == -1 ? reject(value) : resolve(value);
                    }).catch(err => {
                        reject(err)
                    })
                }
            });
        });
    }
}


module.exports = Transaction;