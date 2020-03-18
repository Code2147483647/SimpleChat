const crypto = require('crypto');
const SECRET = 'mySecret';

function md5 (text) {
  const t = crypto.createHash('md5');
  t.update(text);
  return t.digest('hex');
};

function md5Password(password) {
  if (Object.isEmpty(password)) {
    throw new Error('password required');
  }

  const
    md5_1 = md5(password),
    md5_2 = md5(SECRET + md5_1);
  return md5_1 + md5_2;
};

module.exports = {md5Password};
