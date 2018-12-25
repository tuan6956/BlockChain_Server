function hash(txs) {
    return crypto.createHash('sha256')
      .update(txs)
      .digest()
      .toString('hex')
      .toUpperCase();
  }
  module.exports = { hash };
  