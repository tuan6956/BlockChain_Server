'use strict';

var configRedis = require('../config/configRedis');
const  {Keypair, StrKey } = require('stellar-base');
const trans = require('../lib/transaction')
class Account {
    constructor(redis) {
        this.redis = redis;
    }
    
    signin(publicKey, signature) {
        if (!StrKey.isValidEd25519PublicKey(publicKey)) {
            return {statusCode: -1, message: 'invalid public key'};
        }
        if(trans.verify({account: publicKey, signature: signature})) {
            return {statusCode: -1, message: 'invalid signature'};
        }
        const account = redis.
        
    }

    create(address) {

    }

    payment(address, amount) {

    }
    update(type, value){
        switch (type) {
            case 'name':
                
                break;
            case 'picture':
                break;
            default:
                break;
        }
    }
    post(content) {

    }
    interact(type, postId) {

    }
    following(address) {

    }

}

module.exports = Redisson;