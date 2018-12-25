'use strict';

var configRedis = require('../config/configRedis');

class Post {
    constructor() {

    }
    sync(trans, redis) {
        var accountKey = trans.account;
        var text = trans.params.content.toString('utf8');
        await redis.insertHash(configRedis.POST, accountKey, text);
    }

}

module.exports = Post;