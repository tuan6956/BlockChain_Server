'use strict';

var configRedis = require('../config/configRedis');
const { Keypair, StrKey } = require('stellar-base');
const trans = require('../lib/transaction')
const accountRepo = require('../repository/account')
const followRepo = require('../repository/following')
const avatarRepo = require('../repository/avatar')
const tweetRepo = require('../repository/tweet')
const paymentRepo = require('../repository/payment')
const moment = require('moment');
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
                const bandwidthLimit = account.balance / configBanwidth.MAX_CELLULOSE * configBanwidth.NETWORK_BANDWIDTH;
                const diff = account.bandwidthTime
                ? moment(block.block.header.time).unix() - moment(account.bandwidthTime).unix()
                : configBanwidth.BANDWIDTH_PERIOD;
                // 24 hours window max 65kB
                account.bandwidth = Math.ceil(Math.max(0, (configBanwidth.BANDWIDTH_PERIOD - diff) / configBanwidth.BANDWIDTH_PERIOD) * account.bandwidth + account.txSize);
                account.bandwidthLimit = bandwidthLimit
                account.energy = bandwidthLimit - account.bandwidth;

                const follow = followRepo.getOne(this.redis, publicKey);
                const avatar = avatarRepo.getOne(this.redis, publicKey);
                Promise.all([follow, avatar]).then(([follow, avatar]) => {
                    account.followings = follow;
                    account.avatar = avatar;
                    resolve( { statusCode: 1, message: '', value: account });
                });
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
            accountRepo.getOne(this.redis, publicKey).then(account => {
                if (!account) {
                    reject({ statusCode: -1, message: 'account not register'});
                }
                const thisTime = new Date().getTime();
                
                const bandwidthLimit = account.balance / configBanwidth.MAX_CELLULOSE * configBanwidth.NETWORK_BANDWIDTH;
                const diff = account.bandwidthTime
                ? moment(thisTime).unix() - moment(account.bandwidthTime).unix()
                : configBanwidth.BANDWIDTH_PERIOD;
                // 24 hours window max 65kB
                account.bandwidth = Math.ceil(Math.max(0, (configBanwidth.BANDWIDTH_PERIOD - diff) / configBanwidth.BANDWIDTH_PERIOD) * account.bandwidth + account.txSize);
                account.bandwidthLimit = bandwidthLimit
                account.energy = bandwidthLimit - account.bandwidth;

                const follow = followRepo.getOne(this.redis, publicKey);
                const avatar = avatarRepo.getOne(this.redis, publicKey);
                Promise.all([follow, avatar]).then(([follow, avatar]) => {
                    account.followings = follow;
                    account.avatar = avatar;
                    resolve({ statusCode: 1, message: 'ok', value: account });
                });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });
    }

    updateProfile(transaction) {
        return Transaction.commit(transaction);
    }

    getFollowing(publicKey) {
        return new Promise((resolve, reject) => {
            if (!StrKey.isValidEd25519PublicKey(publicKey)) {
                reject({ statusCode: -1, message: 'invalid public key'});
            }
            followRepo.getOne(this.redis, publicKey).then(followings => {
                resolve( { statusCode: 1, message: '', value: {followings: followings} });
            }).catch(err => {
                reject({ statusCode: -1, message: err });
            });
        });        
    }

    following(address) {
        return Transaction.commit(transaction);
    }

}

module.exports = Account;