'use strict';
var configNetwork = require('../config/network')
let { RpcClient } = require('tendermint')
var crypto = require('crypto');
const transaction = require('../lib/transaction')
const configRedis = require('../config/configRedis')
const vstruct = require('varstruct');
const helper = require('../helper')
const accountRepo = require('../repository/account');
const avatarRepo = require('../repository/avatar');
const followingRepo = require('../repository/following');
const interactRepo = require('../repository/interact');
const paymentRepo = require('../repository/payment');
const tweetRepo = require('../repository/tweet');
const configBanwidth = require('../config/configBandwidth')
const moment = require('moment');

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);
const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);
const InteractParams = vstruct([
    { name: 'object', type: vstruct.Buffer(32) },
    { name: 'content', type: vstruct.VarBuffer(vstruct.UInt16BE) },
]);
const ReactContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'reaction', type: vstruct.UInt8 },
]);
class Block {
    constructor() {
        this.processTx.bind(this);
    }
    async init(redis) {
        await syncBlock();
        client.subscribe({ query: 'tm.event = \'NewBlock\'' }, (event) => {
            await syncBlock(redis);

        })
    }
    async syncBlock(redis) {
        var index = 1;
        index = await redis.getString(configRedis.LAST_BLOCK).catch(err => {
            index = 1;
            console.log(err);
        });
        !index ? index = 1 : index;
        //GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7 account của thầy
        let accountTeacher = {
            address: 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7',
            name: '',
            balance: Number.MAX_SAFE_INTEGER,
            sequence: 0,
            bandwidth: 0,
        }
        accountTeacher = await accountRepo.getOne(redis, 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7');
        if(!accountTeacher) {
            accountTeacher = {
                address: 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7',
                name: '',
                balance: Number.MAX_SAFE_INTEGER,
                sequence: 0,
                bandwidth: 0,
            }
            accountRepo.insert(redis, 'GA6IW2JOWMP4WGI6LYAZ76ZPMFQSJAX4YLJLOQOWFC5VF5C6IGNV2IW7', accountTeacher );
        }
        let client = RpcClient('wss://dragonfly.forest.network:443');

        var emptyBlock = false;
        
        while (!emptyBlock) {
            console.log('index block ', index);
            await redis.setString(configRedis.LAST_BLOCK, index - 1);
            await client.block({ height: index++ }).then(async (block) => {
                await redis.insertList(configRedis.BLOCKS, JSON.stringify(block))
                var txs = block.block.data.txs;
                if (txs) {
                    for(let i = 0; i < txs.length; i++) {
                        await this.processTx(redis, block, txs[i], index - 1);
                    }
                    // await txs.forEach(async txs => {
                    //     if (txs) {
                    //         //var trans = transaction.decode(Buffer.from(txs, 'base64'));
                            
                    //     }
                    // });
                }

            }).catch(err => {
                if (err.code == -32603) {
                    emptyBlock = true;
                }
                console.log(err);
            });
            // if(index > 1000) {
            //     return;
            // }
        }

    }
    async processTx(redis, block, txs, height) {
        try {
            var trans = transaction.decode(Buffer.from(txs, 'base64'));
        } catch (error) {
            console.log(error);
            return;
        }
        var txSize = Buffer.from(txs, 'base64').length;
        var hashTrans = helper.hash(txs);
        var accountKey = trans.account;
        

        var account = await redis.getOneHash(configRedis.ACCOUNTS, accountKey).catch(err => {
            console.log(err);
            return;
        })
        if( !account ) {
            console.log('not found account ', height , accountKey);
            return;
        }
        const diff = account.bandwidthTime
            ? moment(block.block.header.time).unix() - moment(account.bandwidthTime).unix()
            : configBanwidth.BANDWIDTH_PERIOD;
        const bandwidthLimit = account.balance / configBanwidth.MAX_CELLULOSE * configBanwidth.NETWORK_BANDWIDTH;
        // 24 hours window max 65kB
        account.bandwidth = Math.ceil(Math.max(0, (configBanwidth.BANDWIDTH_PERIOD - diff) / configBanwidth.BANDWIDTH_PERIOD) * account.bandwidth + txSize);
        // update bandwidthTime
        account.bandwidthTime = block.block.header.time;
        //update sequence
        account.sequence = trans.sequence;
        account.txSize = txSize;

        var receiver;

        switch (trans.operation) {
            case 'create_account':

                let accountCreate = {
                    address: trans.params.address,
                    name: '',
                    balance: 0,
                    sequence: 0,
                    bandwidth: 0,
                    //bandwidthTime: 0,
                }
                //insert my account and new account in cache
                //await redis.insertHash(configRedis.ACCOUNTS, trans.params.address, accountCreate);
                await accountRepo.insert(redis, trans.params.address, accountCreate).then(value => {
                    console.log('create account ' + trans.params.address + ' : ', value );
                });
                
                //await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);

                break;
            case 'payment':
                //get account receiver
                // await redis.getOneHash(configRedis.ACCOUNTS, trans.params.address).then(value => {
                //     receiver = (value);
                // });
                receiver = await accountRepo.getOne(redis, trans.params.address).catch(err => {
                    console.log(err);
                    return;
                })
                if(!receiver) {
                    console.log('receiver ' + receiver + " not found ");
                    break;
                }
                // balance in my account
                account.balance = account.balance - trans.params.amount;

                //update balance in receiver
                receiver.balance = receiver.balance + trans.params.amount;

                //update sender and receiver in cache
                await paymentRepo.insert(redis, {
                    receiver: receiver,
                    sender: accountKey,
                    amount: trans.params.amount,
                    time: block.block.header.time,
                    block_height: block.block.header.height
                });
                await accountRepo.update(redis, trans.params.address, receiver).then(value => {
                    console.log('payment account ', accountKey, ' to ', trans.params.address );
                });
                
                //await redis.insertHash(configRedis.ACCOUNTS, trans.params.address, receiver);
                // await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);

                break;
            case 'post':
                //parse content
                try {
                    let content = PlainTextContent.decode(trans.params.content);
                    let textContent = content.text;
                    //insert post and update account in cache
                    await tweetRepo.insert(redis, hashTrans, { 
                        tweetId: hashTrans, 
                        account: account.address, 
                        content: content, 
                        time: moment(block.block.header.time).unix(),
                        react: [],
                        comment: []
                    }).then(value => {
                        console.log('tweet status ', value)
                    });
                } catch (error) {
                    console.log(error);
                }
                // await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                break;
            case 'update_account':
                //type in update account with name = update name and picture = update avatar
                let key = trans.params.key;
                console.log('update ', key);
                switch (key) {
                    case 'name':
                        //set new name
                        account.name = trans.params.value.toString('utf8');
                        //update name in cache
                        //await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                        break;
                    case 'picture':
                        let bitmap = new Buffer(trans.params.value).toString('base64');
                        //update avatar and sequense in cache
                        //await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                        await avatarRepo.insert(redis, accountKey, bitmap);

                        break;
                    case 'followings':
                        let listFollow = Followings.decode(trans.params.value).addresses.map((snapshot) => {
                            return base32.encode(snapshot);
                        });
                        await followingRepo.insert(redis, accountKey, listFollow);
                        //await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                    default:
                        break;
                        
                }
                // await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                break;
            case 'interact':

                {
                    let objectId = trans.params.object;
                    console.log('interact ', objectId);
                    try {
                        let content = PlainTextContent.decode(trans.params.content)
                        if (content.type == 1) {
                           await interactRepo.insert(redis, objectId, accountKey, 'comment', content.text);
                        }
                    } catch (error) {
                        
                    }
                    try {
                        let content = ReactContent.decode(trans.params.content)
                        if (content.type == 2) {
                            await interactRepo.insert(redis, objectId, accountKey, 'react', content.reaction);
                        }
                    } catch (error) {
                        
                    }
                    // await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
                }
                break;
            default:
                break;
        }
        await accountRepo.update(redis, accountKey, account);
        
        //await redis.insertHash(configRedis.ACCOUNTS, accountKey, account);
    }
}

module.exports = Block;