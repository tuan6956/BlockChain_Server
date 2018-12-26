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

class Account {
    constructor(redis) {
        this.redis = redis;
    }

    signin(publicKey, signature) {
        return new Promise((resolve, reject) => {
            if (!StrKey.isValidEd25519PublicKey(publicKey)) {
                reject({ statusCode: -1, message: 'invalid public key'});
            }
            if (trans.verify({ account: publicKey, signature: signature })) {
                reject({ statusCode: -1, message: 'invalid signature'});
            }
            accountRepo.getOne(this.redis, publicKey).then(account => {
                if (!account) {
                    reject({ statusCode: -1, message: 'account not register'});
                }
                
                const follow = followRepo.getOne(redis, publicKey);
                const avatar = avatarRepo.getOne(redis, publicKey);
                const bandwidthLimit = account.balance / configBanwidth.MAX_CELLULOSE * configBanwidth.NETWORK_BANDWIDTH;
                account.bandwidthLimit = bandwidthLimit
                account.energy = bandwidthLimit - account.bandwidth;
                account.followings = follow;
                account.avatar = avatar;
                resolve( { statusCode: 1, message: '', value: account });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
    }

    create(transaction) {
        return Transaction.commit(transaction);
    }

    getProfile(publicKey) {
        return new Promise((resolve, reject) => {
            if (!StrKey.isValidEd25519PublicKey(publicKey)) {
                reject({ statusCode: -1, message: 'invalid public key'});
            }
            if (trans.verify({ account: publicKey, signature: signature })) {
                reject({ statusCode: -1, message: 'invalid signature'});
            }
            accountRepo.getOne(this.redis, publicKey).then(account => {
                if (!account) {
                    reject({ statusCode: -1, message: 'account not register'});
                }
                const follow = followRepo.getOne(redis, publicKey);
                const avatar = avatarRepo.getOne(redis, publicKey);
                const bandwidthLimit = account.balance / configBanwidth.MAX_CELLULOSE * configBanwidth.NETWORK_BANDWIDTH;
                account.bandwidthLimit = bandwidthLimit
                account.energy = bandwidthLimit - account.bandwidth;
                account.followings = follow;
                account.avatar = avatar;
                resolve( { statusCode: 1, message: '', value: account });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
    }

    updateProfile(transaction) {
        return Transaction.commit(transaction);
    }

    payment(transaction) {
        return Transaction.commit(transaction);
    }

    paymentHistory(publicKey) {
        return new Promise((resolve, reject) => {
            if (!StrKey.isValidEd25519PublicKey(publicKey)) {
                reject({ statusCode: -1, message: 'invalid public key'});
            }
            paymentRepo.getAllByPublicKey(publicKey).then(payment => {
                resolve( { statusCode: 1, message: '', value: {payments: payment} });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
        return 
    }

    getTweet(publicKey) {
        return new Promise((resolve, reject) => {
            if (!StrKey.isValidEd25519PublicKey(publicKey)) {
                reject({ statusCode: -1, message: 'invalid public key'});
            }
            tweetRepo.getAllByPublicKey(publicKey).then(tweet => {
                resolve( { statusCode: 1, message: '', value: tweet });
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

    following(address) {
        return Transaction.commit(transaction);
    }

}

module.exports = Redisson;