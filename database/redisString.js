'use strict';
class RedisString {
    constructor(redis) {
        this.redis = redis;
    }
    findOne(id){
        return new Promise((resolve, reject) => {
            this.redis.get(id, function(err, reply){
                err ? reject(err) : resolve(reply);
            });
        });
    }
    insert(id, value){
        return new Promise((resolve, reject) => {
            this.redis.set(id, value, function (err, reply) {
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
module.exports = RedisString;