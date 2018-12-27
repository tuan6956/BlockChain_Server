const vstruct = require('varstruct');
const crypto = require('crypto');
const { Keypair } = require('stellar-base');
const v1 = require('./v1');

const Transaction = vstruct([
  { name: 'version', type: vstruct.UInt8 },
]);

function encode(tx) {
  switch (tx.version) {
    case 1:
      return v1.encode(tx);

    default:
      throw Error('Unsupport version');
  };
}

function decode(data) {
  const versionTx = Transaction.decode(data);
  switch (versionTx.version) {
    case 1:
      return v1.decode(data);

    default:
      throw Error('Unsupport version');
  }
}

function getUnsignedHash(tx) {
  return crypto
    .createHash('sha256')
    .update(encode({
      ...tx,
      signature: Buffer.alloc(64, 0),
    }))
    .digest();
}

function sign(tx, secret) {
  const key = Keypair.fromSecret(secret);
  tx.account = key.publicKey();
  tx.signature = key.sign(getUnsignedHash(tx));
}

function verify(tx) {
  const key = Keypair.fromPublicKey(tx.account);
  return key.verify(getUnsignedHash(tx), tx.signature);
}

const verifyKeyAndSignature = (publicKey, signature) => {
  let res = null;
  try {
      const hash = crypto.createHash('sha256')
          .update(publicKey)
          .digest();
      console.log(hash.toString('base64'));
      const key = Keypair.fromPublicKey(publicKey);
      res = key.verify(hash, Buffer.from(signature, 'base64'));
  } catch (err) {
      return false;
  }
  
  return res;
}

function hash(tx) {
  return tx.hash = crypto.createHash('sha256')
    .update(encode(tx))
    .digest()
    .toString('hex')
    .toUpperCase();
}

module.exports = { encode, decode, verify, sign, hash, verifyKeyAndSignature };
