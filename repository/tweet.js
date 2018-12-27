const configRedis = require('../config/configRedis')
const accountRepo = require('../repository/account')
const tableTweet = configRedis.POST;

const getOne = (redis, tweetId) => {
    return new Promise((resolve, reject) => {
        redis.getOneHash(tableTweet, tweetId).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const getAll = (redis) => {
    console.log('123123');
    return new Promise((resolve, reject) => {
        
        redis.getAllHash(tableTweet).then(value => {
            // for(let i = 0; i < value.length; i++ ) {
            //     accountRepo.
            // }
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}
const getAllByPublicKey  = (redis, publicKey) => {
    console.log('publicKey', publicKey);
    return new Promise((resolve, reject) => {
        redis.getAllHash(tableTweet).then(value => {
            console.log('getAllByPublicKey', value)
            resolve(value.filter(tweet => tweet.account === publicKey));
        }).catch(err => 
            reject(err)
        );
    }) 
}
const insert = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        redis.insertHash(tableTweet, publicKey, value).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

module.exports = { getOne, getAll, insert, getAllByPublicKey };
