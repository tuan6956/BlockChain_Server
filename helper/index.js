const moment = require('moment');
const trans = require('../lib/transaction')
const accountRepo = require('../repository/account')
const tweetRepo = require('../repository/tweet')
const Decimal = require('decimal.js');
const axios = require('axios')
const network = require('../config/network')
const querystring = require('querystring');
const configBanwidth = require('../config/configBandwidth')
const vstruct = require('varstruct');
const crypto = require('crypto');
function hash(txs) {
  return crypto.createHash('sha256')
    .update(txs)
    .digest()
    .toString('hex')
    .toUpperCase();
}

const PostParams = vstruct([
  { name: 'content', type: vstruct.VarBuffer(vstruct.UInt16BE) },
  { name: 'keys', type: vstruct.VarArray(vstruct.UInt8, vstruct.Buffer(42)) },
]);


async function checkTransaction(redis, transaction) {
  try {
    var buf = Buffer.from(transaction, 'hex');
    var txSize = buf.length;
    
    var tx = trans.decode(buf);
    var account = await accountRepo.getOne(redis, tx.account).catch(err => {
      console.log(err);
      return { statusCode: -1, message: err.message };
    });
    if (!account) {
      return { statusCode: -1, message: 'account does not exist' };
    }
    
    //check sequense
    const nextSequence = new Decimal(account.sequence).add(1);
    
    if (!nextSequence.equals(tx.sequence)) {
      return { statusCode: -1, message: 'Sequence mismatch' };
    }
    //check meno length
    if (tx.memo.length > 32) {
      return { statusCode: -1, message: 'Memo has more than 32 bytes.' };
    }

    //check bandwith
    const thisTime = new Date().getTime();
    const diff = account.bandwidthTime
      ? moment(thisTime).unix() - moment(account.bandwidthTime).unix()
      : configBanwidth.BANDWIDTH_PERIOD;
    const bandwidthLimit = account.balance / configBanwidth.MAX_CELLULOSE * configBanwidth.NETWORK_BANDWIDTH;
    // 24 hours window max 65kB
    var accountBandwidth = Math.ceil(Math.max(0, (configBanwidth.BANDWIDTH_PERIOD - diff) / configBanwidth.BANDWIDTH_PERIOD) * account.bandwidth + txSize);
    if (accountBandwidth > bandwidthLimit) {
      return { statusCode: -1, message: 'Bandwidth limit exceeded' };
    }

    // Check bandwidth usage < account balance
    const blockedAmount = Math.ceil(account.bandwidth / configBanwidth.NETWORK_BANDWIDTH * configBanwidth.MAX_CELLULOSE);
    console.log('Blocked amount:', blockedAmount);
    if (new Decimal(account.balance).lt(blockedAmount)) {
      return { statusCode: -1, message: 'Account balance must greater blocked amount due to bandwidth used' };
    }

    // check operation
    if (tx.params.address) {
      var foundAccount = await accountRepo.getOne(redis, tx.params.address).catch(err => {
        console.log(err);
        return { statusCode: -1, message: err.message };
      });
    }
    let operation = tx.operation;
    if (operation === 'create_account') {
      const { address } = tx.params;
      if (!foundAccount) {
        return { statusCode: -1, message: 'Account address register existed' };
      }
    } else if (operation === 'payment') {
      const { address, amount } = tx.params;
      if (!foundAccount) {
        return { statusCode: -1, message: 'Destination address does not exist' };
      }
      if (address === tx.account) {
        return { statusCode: -1, message: ('Cannot transfer to the same address') };
      }
      if (amount <= 0) {
        return { statusCode: -1, message: ('Amount must be greater than 0') };
      }
      if (new Decimal(amount).gt(account.balance)) {
        return { statusCode: -1, message: ('Amount must be less or equal to source balance') };
      }
    } else if (operation === 'post') {
      const { content, keys } = tx.params;
    } else if (operation === 'update_account') {
      const { key, value } = tx.params;
    } else if (operation === 'interact') {
      const { object, content } = tx.params;
      // Check if object exists
      let tweet = await tweetRepo.getOne(redis, object).catch(err => {
        console.log(err);
        return { statusCode: -1, message: err.message };
      });

      if (!tweet) {
        return { statusCode: -1, message: ('tweet does not exist') };
      }
    } else {
      return { statusCode: -1, message: ('Operation is not support.') };
    }
    return { statusCode: 1, message: '' };
  } catch (error) {
    return { statusCode: -1, message: error.message }
  }
}

function commitTransaction(transaction) {
  return new Promise((resolve, reject) => {
    axios.post(network.API_URL + 'broadcast_tx_commit', querystring.stringify({ tx: '0x'+ transaction })).then(response => {
      var data = response.data;
      console.log(data);
      try {
        var check_tx_log = data.result.check_tx.log;
        if(check_tx_log) {
          reject({statusCode: -1, message: check_tx_log});
        } 
      } catch (error) {
        
      }
      try {
        var error = data.error;
        if(error) {
          reject({statusCode: -1, message: error.data});
        } 
      } catch (error) {
        
      }


      resolve({statusCode: 1, value: data.hash});
    }).catch(err => {
      reject({statusCode: -1, message: err.message});
    })
  });
}


module.exports = { hash, checkTransaction, commitTransaction };
