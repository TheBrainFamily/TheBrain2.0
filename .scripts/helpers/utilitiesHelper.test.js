const {generateMd5Hash} = require('./utilitiesHelper')

describe('utilitiesHelper', () => {
  describe('generateMd5Hash', () => {
    it('should return truncated md5 hash of string', () => {
      expect(generateMd5Hash('develop')).toEqual('107d38c')
    })
  })
})
