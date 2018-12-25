const configRedis = require('../config/configRedis')

const tableAccount = configRedis.ACCOUNTS;

const getOne = (redis, publicKey) => {
    return new Promise((resolve, reject) => {
        redis.getOneHash(tableAccount, publicKey).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const getAll = (redis) => {
    return new Promise((resolve, reject) => {
        redis.getAllHash(tableAccount).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const insert = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        redis.insertHash(tableAccount, publicKey, value).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}

const update = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        redis.updateHash(tableAccount, publicKey, value).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}
module.exports = { getOne, getAll, insert, update };
