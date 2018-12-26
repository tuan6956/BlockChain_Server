const configRedis = require('../config/configRedis')

const tablePayment = configRedis.PAYMENT;



const getAll = (redis) => {
    return new Promise((resolve, reject) => {
        redis.getList(tablePayment).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}
const getAllByPublicKey  = (redis, publicKey) => {
    return new Promise((resolve, reject) => {
        redis.getList(tablePayment).then(value => {
            resolve(value.filter(payment => {payment.sender === publicKey || payment.receiver === publicKey}));
        }).catch(err => 
            reject(err)
        );
    }) 
}
const insert = (redis, value) => {
    return new Promise((resolve, reject) => {
        redis.insertList(tablePayment, value).then(value => {
            resolve(value);
        }).catch(err => 
            reject(err)
        );
    });
}


module.exports = { getAll, insert, getAllByPublicKey };
