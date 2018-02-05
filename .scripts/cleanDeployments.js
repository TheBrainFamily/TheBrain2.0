const AWS = require('aws-sdk')
const Promise = require('promise')
AWS.config.update({region: 'us-east-1'})

class CleanDeployments {
  constructor () {
    this.cloudFormation = new AWS.CloudFormation()
    this.s3 = new AWS.S3()
  }

  async clean () {
    const stacks = await this.getStacks()
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i]
        console.log('Stack to delete: ', stack.StackName)
      if (/serverless-hello-world-1.*/.test(stack.StackName)) {
        console.log('Stack to delete: ', stack.StackName)
        process.stdout.write('Checking for S3 bucket resources: ')
        const stackS3Resource = await this.getStackS3BucketResource(stack.StackName)
        if (stackS3Resource) {
          console.log('Yes')
          const bucket = stackS3Resource.PhysicalResourceId
          const contentKeys = await this.getS3BucketContentsKeys(bucket)
          console.log('Checking for S3 bucket content...')
          if (this.s3BucketHasContent(contentKeys)) {
            console.log('Found, deleting...')
            await this.deleteS3BucketContents(bucket, contentKeys)
          }
        }
        else console.log('No')

        console.log('Deleting stack: ', stack.StackName, "\n")
        await this.deleteStack(stack.StackName)
      }
    }
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

  isS3Bucket (resourceType) {
    return resourceType === 'AWS::S3::Bucket'
  }

  isResourceExists (resourceStatus) {
    const resourceStatuses = ['CREATE_COMPLETE', 'UPDATE_COMPLETE']
    return resourceStatuses.indexOf(resourceStatus) !== -1
  }

  deleteStack (StackName) {
    return new Promise((resolve, reject) => {
      this.cloudFormation.deleteStack({StackName}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  getS3BucketContentsKeys (Bucket) {
    return new Promise((resolve, reject) => {
      this.s3.listObjects({Bucket}, (err, data) => {
        if (err) reject(err)
        else {
          const keys = []
          data.Contents.forEach(content => keys.push({Key: content.Key}))
          resolve(keys)
        }
      })
    })
  }

  deleteS3BucketContents (Bucket, contentsKeys) {
    const params = {
      Bucket,
      Delete: {
        Objects: contentsKeys
      }
    }
    return new Promise((resolve, reject) => {
      this.s3.deleteObjects(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  s3BucketHasContent (content) {
    return content.length > 0
  }

}

const cleanDeployments = new CleanDeployments()
cleanDeployments.clean()
