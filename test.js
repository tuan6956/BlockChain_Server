const trans = require('./lib/transaction')
const {Keypair, StrKey} = require('stellar-base');
const moment = require('moment');
const configBanwidth = require('./config/configBandwidth')
const helper = require('./helper')
const publicKey = 'GDAIRCS73RR5LJXWA2IRQLIYDVUKG4TYRGV2WGPRS7LJBYXOVXRT3JOC';
const privateKey = 'SC6EN5ILS7746C2UYEZCY4JPA2VKD5WG75ZJXM4LUSIRHMSFW3FA2ONC';

const encode = () => {
    const dataPayment = {
        version: 1,
        account: publicKey,
        sequence: 11,
        memo: Buffer.alloc(0),
        operation: 'payment',
        params: {
            address: "GBNZQNZLN4JGF3NBJ6L5VSBF4G2TDX337T5FJJRLZT2QACL7MSWTUGEA",
            amount: 1,
        },
    }
    var key = Keypair.random();
    let publicKeyCre = key.publicKey();
    const dataCreateAccount = {
        version: 1,
        account: publicKey,
        sequence: 13,
        memo: Buffer.alloc(0),
        operation: 'create_account',
        params: {
            address: publicKeyCre,
        },
    }
    console.log(publicKeyCre)
    trans.sign(dataCreateAccount, privateKey);
    hashTx = trans.encode(dataCreateAccount).toString('hex');
    console.log(hashTx);
}
function x(){
    return new Promise((resolve, reject) => {
       reject('123');
    });
}
async function abc(){
    var i = 0;
    while(i++ < 10) {
        await console.log(i);
    }
    console.log(11);
}
async function ss(){
    await console.log('123');
    console.log('456');
}
abc();

// try {
//     var a = StrKey.isValidEd25519SecretSeed('SC6EN5ILS7746C2UYEZCY4JPA2VKD5WG75ZJXM4LUSIRHMSFW3FA2ONC');
// } catch (error) {
    
// }
// console.log(a);
//abc().then(value => {console.log(value)})

// const ab = abc();
//console.log(ss());
// const vl = helper.checkTransaction(null, '0130c0888a5fdc63d5a6f60691182d181d68a3727889abab19f197d690e2eeade33da5c200000000000000100002002b305b98372b6f1262eda14f97dac825e1b531df7bfcfa54a62bccf500097f64ad3a188000000000000000019d70b5d3fbeedb859116e7f68e8158f60c0e10ed4701486e112e9c592531f97023f4407adcb9caca29b912d3be130445a48c36bcdd45442d8c3ed738f6ca7204', null);
// console.log(vl);
//  var b64string = "ATDAiIpf3GPVpvYGkRgtGB1oo3J4iaurGfGX1pDi7q3jPaXCAAAAAAAAAA0AAQAjMOAYQb1q2kFx/pnmQQyN3ZwQGyZHVSSyUlmmyRMhmkapP52tciaypR1sAZWVxvgSZ965kfNU3OqW7nnduv7rQ8LCgZzJ/dV+jAFytNMMm8xsNvX56aa8r+PRoMkyMXoF76AK";/* whatever */
//  var buf = Buffer.from(b64string, 'base64');
//  var x = trans.decode(buf)
//  console.log(x);
//encode();

