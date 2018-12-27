const configRedis = require('../config/configRedis')

const tableFollowings = configRedis.FOLLOWINGS;

const getOne = (redis, publicKey) => {
    return new Promise((resolve, reject) => {
        redis.getOneHash(tableFollowings, publicKey).then(value => {
            resolve(value);
        }).catch(err =>
            reject(err)
            );
    });
}

const getAll = (redis) => {
    return new Promise((resolve, reject) => {
        redis.getAllHash(tableFollowings).then(value => {
            resolve(value);
        }).catch(err =>
            reject(err)
            );
    });
}

const insert = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        redis.insertHash(tableFollowings, publicKey, value).then(value => {
            resolve(value);
        }).catch(err =>
            reject(err)
        );
    });
}

const remove = (redis, publicKey, value) => {
    return new Promise((resolve, reject) => {
        getOne(redis, publicKey).then(follow => {
            if (!follow) {
                reject("follow undefined");
            } else {
                var listFollow = (follow);
                var index = listFollow.indexOf(value);
                if (index > -1) {
                    listFollow.splice(index, 1);
                }
                redis.updateHash(tableFollowings, publicKey, listFollow).then(value => {
                    resolve(value);
                }).catch(err =>
                    reject(err)
                    );
            }
        }).catch(err => reject(err))
    });
}
module.exports = { getOne, getAll, insert, remove };
