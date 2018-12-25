'use strict';

var configRedis = require('../config/configRedis');

class Avatar {
    constructor() {

    }
    sync(trans, redis) {
        var accountKey = trans.account;
        var picture = trans.params.value;
        await redis.insertHash(configRedis.AVATAR, accountKey, picture);
    }

}

module.exports = Avatar;