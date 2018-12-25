const configRedis = require('../config/configRedis')

const tableTweet = configRedis.POST;
const tweetRepo = require('./tweet');

const insert = (redis, tweetId, publicKey, type, value) => {
    return new Promise((resolve, reject) => {
        tweetRepo.getOne(redis, tweetId).then(tweet => {
            if(!tweet) {
                reject("tweet undefined");
            } else {
                if (type === 'react') {
                    var objIndex = tweet.react.findIndex((obj => obj.publicKey === publicKey));
                    if(objIndex != -1) {
                        tweet.react[objIndex].type = value;
                    } else {
                        tweet.react.push({publicKey: publicKey, type: value});
                    }
                } else if (type === 'comment') {
                    tweet.comment.push({publicKey: publicKey, content: value});
                }

                redis.insertHash(tableTweet, tweetId, tweet).then(value => {
                    resolve(value);
                }).catch(err => 
                    reject(err)
                );
            }
        })
    });
}


module.exports = { getOne, getAll, insert, update };
