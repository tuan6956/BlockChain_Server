const trans = require('./lib/transaction')
const {Keypair} = require('stellar-base');

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

 var b64string = "ATDAiIpf3GPVpvYGkRgtGB1oo3J4iaurGfGX1pDi7q3jPaXCAAAAAAAAAA0AAQAjMOAYQb1q2kFx/pnmQQyN3ZwQGyZHVSSyUlmmyRMhmkapP52tciaypR1sAZWVxvgSZ965kfNU3OqW7nnduv7rQ8LCgZzJ/dV+jAFytNMMm8xsNvX56aa8r+PRoMkyMXoF76AK";/* whatever */
 var buf = Buffer.from(b64string, 'base64');
 var x = trans.decode(buf)
 console.log(x);
//encode();
