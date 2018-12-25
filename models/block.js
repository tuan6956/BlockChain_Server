'use strict';
var configNetwork = require('../config/network')
let { RpcClient } = require('tendermint')
const transaction = require('../lib/transaction')
const configRedis = require('../config/configRedis')
const vstruct = require('varstruct');
const helper = require('../helper')
const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);
class Block {
    constructor() {

    }
    async syncBlock(redis) {
        var index = 1;
        await redis.getString(configRedis.LAST_BLOCK).then(
            value => {
                value ? index = parseInt(value) : 1;
            }
        ).catch(err => {
            index = 1;
            console.log(err);
        });

        let client = RpcClient('wss://zebra.forest.network:443');

        var emptyBlock = false;
        while (!emptyBlock) {
            console.log('index block ', index);
            redis.setString(configRedis.LAST_BLOCK, index - 1);
            await client.block({ height: index++ }).then(block => {
                redis.insertList(configRedis.BLOCKS, JSON.stringify(block))
                var txs = block.block.data.txs;
                if (txs) {
                    txs.forEach(txs => {
                        if (txs) {
                            var transaction = trans.decode(Buffer.from(txs, 'base64'));
                            console.log(transaction);
                        }
                    });
                }
            }).catch(err => {
                if (err.code == -32603) {
                    emptyBlock = true;
                }
                console.log(err);
            });
        }
    }
    async processTx(redis, block, txs) {
        var trans = transaction.decode(Buffer.from(txs, 'base64'));
        var hashTrans = helper.hash(txs);
        var accountKey = trans.account;
        var account = {
            address: '',
            name: '',
            balance: 0,
            sequence: 0,
            bandwidth: 0,
            bandwidthTime: 0,
        }
        await redis.getOneHash(configRedis.ACCOUNTS, accountKey).then(value => {
            account = (value);
        });
        
        const diff = account.bandwidthTime
            ? moment(block.block.header.time).unix() - moment(account.bandwidthTime).unix()
            : BANDWIDTH_PERIOD;
        const bandwidthLimit = account.balance / MAX_CELLULOSE * NETWORK_BANDWIDTH;
        // 24 hours window max 65kB
        account.bandwidth = Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * account.bandwidth + txSize);
        // update bandwidthTime
        account.bandwidthTime = block.block.header.time;
        //update sequence
        account.sequence = trans.sequence;
        

        var receiver;

        switch (trans.operation) {
            case 'create_account':

                var accountCreate = {
                    address: trans.params.address,
                    balance: 0,
                    sequence: 0,
                    bandwidth: 0,
                    bandwidthTime: 0,
                }
                //insert my account and new account in cache
                await redis.insertHash(configRedis.ACCOUNTS, trans.params.address, accountCreate);
                await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                
                break;
            case 'payment':
                //get account receiver
                await redis.getOneHash(configRedis.ACCOUNTS, trans.params.address).then(value => {
                    receiver = (value);
                });
                // balance in my account
                account.balance = account.balance - trans.params.amount;

                //update balance in receiver
                receiver.balance = receiver.balance + trans.params.amount;

                //update sender and receiver in cache

                await redis.insertHash(configRedis.ACCOUNTS, trans.params.address, receiver);
                await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);

                break;
            case 'post':

                //parse content
                var content = trans.params.content.toString('utf-8');
                //insert post and update account in cache
                await redis.insertHash(configRedis.POST, hashTrans, {tweetId: hashTrans, account: account.address, content: content, time: moment(block.block.header.time).unix()});
                await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                break;
            case 'update_account':
                //type in update account with name = update name and picture = update avatar
                var key = trans.params.key;
                switch (key) {
                    case 'name':
                        //set new name
                        account.name = trans.params.value.toString('utf8');
                        //update name in cache
                        await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);

                        break;
                    case 'picture':
                        var bitmap = new Buffer(trans.params.value).toString('base64');
                        //update avatar and sequense in cache
                        await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                        await redis.insertHash(configRedis.AVATAR, accountKey, bitmap);
                        
                        break;
                    case 'followings':
                        var listFollow = Followings.decode(trans.params.value).addresses.map((snapshot) => {
                            return base32.encode(snapshot);
                        });
                        await redis.insertHash(configRedis.FOLLOWINGS, accountKey, listFollow);
                        await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                    default:
                        break;
                }
                break;
            case 'interact':

                break;
            default:
                break;
        }
    }
}

module.exports = Block;