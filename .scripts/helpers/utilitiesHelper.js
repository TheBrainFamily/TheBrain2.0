const crypto = require('crypto')

function generateMd5Hash (string) {
  return crypto.createHash('md5').update(`${string}\n`).digest('hex').substr(0, 7)
}

module.exports = {
  generateMd5Hash
}
