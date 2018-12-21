'use strict';

var Redlock = require('redlock');
var redis = require('redis');
var RedisHash = require('./redisHash');
var RedisList = require('./redisList');

class Redisson {
    constructor() {
        this.lockRessource.bind(this);
        this.unlockLock.bind(this);
    }

    connect(host = '127.0.0.1', port = 6379) {
        this.client = redis.createClient(port, host);
        this.redlock = new Redlock(
            [this.client], {
                driftFactor: 0.01,
                retryCount: 15,
                retryDelay: 200
            }
        );

        this.client.on('connect', function () {
            console.log("Redis default connection open to " + host + ":" + port);
            console.log("connected");
        });

        this.client.on('error', function (err) {
            console.log("Redis default connection error " + err);
            console.log("Redis Path : " + host + ":" + port);
        });

        this.redlock.on('clientError', function (err) {
            console.log("A Redis Error Has Occurred : " + err);
        });

        process.on('SIGINT', function () {
            client.quit();
            console.log("Redis default connection disconnected");
            process.exit(0);
        });

    }

    lockRessource(ressource_id = 'resource') {
        if (!this.redisHash) {
            console.log("undefind redisHash");
            this.redisHash = new RedisHash(this.client);
        }
        if (!this.redisList) {
            console.log("undefind redisList");
            this.redisList = new RedisList(this.client);
        }
        return this.redlock.lock(ressource_id, 2000);
    };

    unlockLock(lock) {
        lock.unlock().catch(err => {
            console.log(err);
        });
    };

    getList(id) {
        console.log(this.lockRessource)
        this.lockRessource.then(lock => {
            var result = this.redisList.findOne(id);
            unlockLock(lock);
            return result;
        })
    }

    insertList(id, value) {
        lockRessource.then(lock => {
            var result = this.redisList.insert(id, value);
            unlockLock(lock);
            return result;
        })
        return this.redisList.insert(id, value);
    }

    removeList(id) {
        return this.redisHash.remove(id);
    }

    async getOneHash(table, id) {
        if (!this.redisList) {
            console.log("undefind redisList");
            this.redisHash = new RedisList(this.client);
        }
        var result;
        return this.redisHash.findOne(table, id);

        // await this.lockRessource().then(lock => {
        //     console.log(lock);
        //     result = this.redisHash.findOne(table, id);
        //     this.unlockLock(lock);
        // })
        return result;

    }
    getAllHash(table) {
        return this.redisHash.findAll(table);
    }
    insertHash(table, id, value) {
        console.log(this.redisHash)
        return this.redisHash.insert(table, id, value);
    }
    updateHash(table, id, value) {
        return this.redisHash.update(table, id, value);
    }
    removeItemInHash(table, id) {
        return this.redisHash.remove(table, id);
    }
    removeAllHash(table) {
        return this.redisHash.removeAll(table);
    }
}

module.exports = Redisson;