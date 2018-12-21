'use strict';
class RedisList {
    constructor(redis) {
        this.redis = redis;
    }
    findOne(id){
        return this.redis.lrange(id, 0, -1);
    }
    insert(id, value){
        return this.redis.rpush(id, value);
    }
    remove(id){
        return this.redis.del(id);
    }
}
module.exports = RedisList;