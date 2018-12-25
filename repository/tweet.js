const configRedis = require('../config/configRedis')

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
    return new Promise((resolve, reject) => {
        redis.getAllHash(tableTweet).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
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
module.exports = { getOne, getAll, insert };
