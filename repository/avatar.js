const configRedis = require('../config/configRedis')

const tableAvatar= configRedis.AVATAR;

const getOne = (redis, publicKey) => {
    return new Promise((resolve, reject) => {
        redis.getOneHash(tableAvatar, publicKey).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const getAll = (redis) => {
    return new Promise((resolve, reject) => {
        redis.getAllHash(tableAvatar).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const insert = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        redis.insertHash(tableAvatar, publicKey, value).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const update = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        redis.updateHash(tableAvatar, publicKey, value).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}
module.exports = { getOne, getAll, insert, update };
