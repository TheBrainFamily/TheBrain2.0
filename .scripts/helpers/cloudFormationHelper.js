const Promise = require('promise')
const moment = require('moment')

class CloudFormationHelper {
  constructor (cloudFormation) {
    this.cloudFormation = cloudFormation
  }

  getStacks () {
    const params = {
      StackStatusFilter: [
        'CREATE_COMPLETE',
        'ROLLBACK_COMPLETE',
        'UPDATE_COMPLETE',
        'UPDATE_ROLLBACK_COMPLETE'
      ]
    }
    return new Promise((resolve, reject) => {
      this.cloudFormation.listStacks(params, (err, data) => {
        if (err) reject(err)
        else resolve(data.StackSummaries)
      })
    })
  }

  getStackS3BucketResource (StackName) {
    return new Promise((resolve, reject) => {
      this.cloudFormation.listStackResources({StackName}, (err, data) => {
        if (err) reject(err)
        else {
          resolve(data.StackResourceSummaries.filter(resource => this.isS3Bucket(resource.ResourceType) && this.isResourceExists(resource.ResourceStatus))[0])
        }
      })
    })
  }

  deleteStack (StackName) {
    return new Promise((resolve, reject) => {
      this.cloudFormation.deleteStack({StackName}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  isStackOlderThan (days, stack) {
    const stackTime = stack.StackStatus === 'CREATE_COMPLETE' ? stack.CreationTime : stack.LastUpdatedTime
    const currentTimeObject = moment()
    const stackTimeObject = moment(stackTime)
    const diffDays = currentTimeObject.diff(stackTimeObject, 'days')
    return diffDays > days
  }

  isResourceExists (resourceStatus) {
    const resourceStatuses = ['CREATE_COMPLETE', 'UPDATE_COMPLETE']
    return resourceStatuses.indexOf(resourceStatus) !== -1
  }

  isS3Bucket (resourceType) {
    return resourceType === 'AWS::S3::Bucket'
  }
}

module.exports = CloudFormationHelper
