'use strict';

var Redlock = require('redlock');
var redis = require('redis');
var jsonify = require('redis-jsonify')

var RedisHash = require('./redisHash');
var RedisList = require('./redisList');
var RedisString = require('./redisString');

class Redisson {
    constructor() {
        this.lockRessource.bind(this);
        this.unlockLock.bind(this);
        this.init.bind(this);
    }
    init() {
        if (!this.redisHash) {
            console.log("undefind redisHash");
            this.redisHash = new RedisHash(this.client);
        }
        if (!this.redisList) {
            console.log("undefind redisList");
            this.redisList = new RedisList(this.client);
        }
        if (!this.redisString) {
            console.log("undefind redisList");
            this.redisString = new RedisString(this.client);
        }
    };

    connect(host = '127.0.0.1', port = 6379) {
        this.client = jsonify(redis.createClient(port, host));
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
        this.init();
        return this.redlock.lock(ressource_id, 2000);
    };

    unlockLock(lock) {
        lock.unlock().catch(err => {
            console.log(err);
        });
    };

    getList(id) {
        this.init();
        return this.redisList.findOne(id);
    }

    async insertList(id, value) {
        var result;
        await this.lockRessource().then(lock => {
            result = this.redisList.insert(id, (value));
            this.unlockLock(lock);
        })
        return result;
    }

    async removeList(id) {
        var result;
        this.lockRessource().then(lock => {
            result = this.redisHash.remove(id);
            this.unlockLock(lock);
        })
        return result
    }

    getOneHash(table, id) {
        this.init();
        return this.redisHash.findOne(table, id);
    }

    getAllHash(table) {
        this.init();
        return this.redisHash.findAll(table);
    }

    async insertHash(table, id, value) {
        var result;
        await this.lockRessource().then(lock => {
            result = this.redisHash.insert(table, id, (value));
            this.unlockLock(lock);
        })
        return result;
    }
    
    async updateHash(table, id, value) {
        var result;
        await this.lockRessource().then(lock => {
            result = this.redisHash.update(table, id,(value));
            this.unlockLock(lock);
        })
        return result;
    }

    async removeItemInHash(table, id) {
        var result;
        await this.lockRessource().then(lock => {
            result = this.redisHash.remove(table, id);
            this.unlockLock(lock);
        })
        return result;
    }
    async removeAllHash(table) {
        var result;
        await this.lockRessource().then(lock => {
            result = this.redisHash.removeAll(table);
            this.unlockLock(lock);
        })
        return result;
    }

    getString(id) {
        this.init();
        return this.redisString.findOne(id);
    }

    async setString(id, value) {
        var result;
        await this.lockRessource().then(lock => {
            result = this.redisString.insert(id, (value));
            this.unlockLock(lock);
        })
        return result;
    }
}

module.exports = Redisson;