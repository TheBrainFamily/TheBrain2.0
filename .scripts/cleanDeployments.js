const AWS = require('aws-sdk')
const Promise = require('promise')
const moment = require('moment')
const MongoClient = require('mongodb')

AWS.config.update({region: 'us-east-1'})

class CleanDeployments {
  constructor () {
    this.cloudFormation = new AWS.CloudFormation()
    this.s3 = new AWS.S3()
    this.baseMongoUrl = process.env.BASE_STAGING_MONGOURL
    this.buildVersionLabel = process.env.BUILD_VERSION_LABEL
    this.db = undefined
  }

  async clean () {
    const stacks = await this.getStacks()
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i]
      const {StackName} = stack
      const branchVersionLabel = this.getBranchVersionLabel(StackName)

      if (branchVersionLabel !== this.buildVersionLabel && this.isStackOlderThan(7, stack)) {
        console.log('Stack to delete: ', StackName)
        process.stdout.write('Checking for S3 bucket resources...')
        const stackS3Resource = await this.getStackS3BucketResource(StackName)
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
        else console.log('There is no S3 bucket resources')

        console.log('Deleting stack: ', StackName, '\n')
        await this.deleteStack(StackName)

        process.stdout.write('Trying to connect to Mongo db...')
        if (this.isMongoUrlExist()) {
          try {
            await this.connectToDatabase(branchVersionLabel)
            console.log('connected')
            console.log('Dropping database...')
            await this.dropDatabase(branchVersionLabel)
            console.log('Done')
          }
          catch (e) {
            console.log('Can\'t connect to db')
          }
        }
        else console.log('There is no Mongo url present in system environment')

        process.stdout.write('Checking for Web deployment...')
        try {
          const webDeploymentBucket = `thebrain-web-${branchVersionLabel}`
          const webDeploymentContentKeys = await this.getS3BucketContentsKeys(webDeploymentBucket)
          console.log('Yes')
          console.log('Checking for S3 bucket content...')
          if (this.s3BucketHasContent(webDeploymentContentKeys)) {
            console.log('Found, deleting...')
            await this.deleteS3BucketContents(webDeploymentBucket, webDeploymentContentKeys)
          }
          console.log(`Deleting Web bucket: ${webDeploymentBucket}`)
          await this.deleteS3Bucket(webDeploymentBucket)

        }
        catch (e) {
          console.log('There is no Web deployment')
        }
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

  isStackOlderThan (days, stack) {
    const stackTime = stack.StackStatus === 'CREATE_COMPLETE' ? stack.CreationTime : stack.LastUpdatedTime
    const currentTimeObject = moment()
    const stackTimeObject = moment(stackTime)
    const diffDays = currentTimeObject.diff(stackTimeObject, 'days')
    return diffDays > days
  }

  getBranchVersionLabel (stackName) {
    return stackName.replace(/^thebrain-server-/, '').replace(/-dev$/, '')
  }

  deleteS3Bucket (Bucket) {
    return new Promise((resolve, reject) => {
      this.s3.deleteBucket({Bucket}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  isMongoUrlExist () {
    return this.baseMongoUrl !== undefined && this.baseMongoUrl !== ''
  }

  async connectToDatabase (branchVersionLabel) {
    const mongoUrl = this.baseMongoUrl.replace('${MY_DB_NAME}', branchVersionLabel)
    this.db = await MongoClient.connect(mongoUrl)
  }

  async dropDatabase (branchVersionLabel) {
    const database = await this.db.db(branchVersionLabel)
    await database.dropDatabase()
    await this.db.close()
  }

}

const cleanDeployments = new CleanDeployments()
cleanDeployments.clean()
