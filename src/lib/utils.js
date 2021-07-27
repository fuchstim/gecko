const crypto = require('crypto');

function hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = {
  hash,
};
