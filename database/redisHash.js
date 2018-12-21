
'use strict';
class RedisHash {

    constructor(redis) {
        this.redis = redis;
        console.log('create redis hash');
    }
    sayHello(){
        console.log('123213');
    }
    findOne(table, id){
        return new Promise((resolve, reject) => {
            this.redis.hmget(table, id, function(err, reply){
                console.log(reply);
                err ? reject(err) : resolve(reply);
            });
        });
    }
    findAll(table){
        return this.redis.hgetall(table);
    }
    insert(table, id, value){
        return this.redis.hmset(table, id, value);
    }
    update(table, id, value){
        return this.redis.hset(table, id, value);
    }
    remove(table, id){
        this.redis.hdel(table, id);
    }
    removeAll(table){
        this.redis.del(table);
    }
}
module.exports = RedisHash;
