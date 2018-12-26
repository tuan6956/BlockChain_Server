
'use strict';
class RedisHash {

    constructor(redis) {
        this.redis = redis;
        console.log('create redis hash');
    }

    findOne(table, id) {
        return new Promise((resolve, reject) => {
            this.redis.hget(table, id, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
    findAll(table) {
        return new Promise((resolve, reject) => {
            this.redis.hgetall(table, function (err, reply) {
                err ? reject(err) : resolve(reply ? Object.keys(reply).map((key) => {return JSON.parse(reply[key])}) : reply);
            });
        });
    }

    insert(table, id, value) {
        return new Promise((resolve, reject) => {
            this.redis.hset(table, id, value, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
    update(table, id, value) {
        return new Promise((resolve, reject) => {
            this.redis.hset(table, id, value, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
    remove(table, id) {
        return new Promise((resolve, reject) => {
            this.redis.hdel(table, id, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
    removeAll(table) {
        return new Promise((resolve, reject) => {
            this.redis.del(table, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });

    }
}
module.exports = RedisHash;
