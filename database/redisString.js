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
        return this.redis.set(id, value);
    }
    remove(id){
        return this.redis.del(id);
    }
}
module.exports = RedisString;