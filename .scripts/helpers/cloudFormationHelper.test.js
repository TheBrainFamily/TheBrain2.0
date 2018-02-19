describe('CloudFormationHelper', function () {
  describe('constructor', function () {
    it('should set `cloudFormation` when `cloudFormation` param is passed', function () {
      throw new Error('Not implemented')
    })
  })
  describe('getStacks', function () {
    it('should return array of CloudFormation Stacks', function () {
      throw new Error('Not implemented')
    })
  })
  describe('getStackS3BucketResource', function () {
    it('should return array of Stack S3 bucket resources based on `StackName` param', function () {
      throw new Error('Not implemented')
    })
    it('should reject promise when error is present', function () {
      throw new Error('Not implemented')
    })
  })
  describe('deleteStack', function () {
    it('should delete stack based on `StackName`', function () {
      throw new Error('Not implemented')
    })
  })
  describe('isStackOlderThan', function () {
    it('should return `true` if `stack` param is older then `days` param', function () {
      throw new Error('Not implemented')
    })
    it('should return `false` when `stack` param is younger or equal `days` param', function () {
      throw new Error('Not implemented')
    })
  })
  describe('isResourceExists', function () {
    it('should return `true` when `resourceStatus` param exists in `resourceStatuses`', function () {
      throw new Error('Not implemented')
    })
    it('should return `true` when `resourceStatus` param does exist in `resourceStatuses`', function () {
      throw new Error('Not implemented')
    })
  })
  describe('isS3Bucket', function () {
    it('should return `true` if `resourceType` param is S3 bucket', function () {
      throw new Error('Not implemented')
    })
    it('should return `false` if `resourceType` param is not S3 bucket', function () {
      throw new Error('Not implemented')
    })
  })
})
