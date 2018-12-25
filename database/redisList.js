'use strict';
class RedisList {
    constructor(redis) {
        this.redis = redis;
    }
    findOne(id){
        return new Promise((resolve, reject) => {
            this.redis.lrange(id, 0, -1, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
    insert(id, value){
        return new Promise((resolve, reject) => {
            this.redis.rpush(id, value, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
    remove(id){
        return new Promise((resolve, reject) => {
            this.redis.del(id, function (err, reply) {
                err ? reject(err) : resolve(reply);
            });
        });
    }
}
module.exports = RedisList;