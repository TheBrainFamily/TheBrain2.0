const AWS = require('aws-sdk')
const Promise = require('promise')
const moment = require('moment')
const MongoClient = require('mongodb')
const crypto = require('crypto')

AWS.config.update({region: 'us-east-1'})

class CleanDeployments {
  constructor () {
    this.cloudFormation = new AWS.CloudFormation()
    this.s3 = new AWS.S3()
    this.baseMongoUrl = process.env.BASE_STAGING_MONGOURL
    this.buildVersionLabel = process.env.BUILD_VERSION_LABEL
    this.db = undefined
    this.protectedBranches = ['master', 'develop']
    this.updateProtectedBranches()
  }

  async clean () {
    const stacks = await this.getStacks()
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i]
      const {StackName} = stack
      const branchVersionLabel = this.getBranchVersionLabel(StackName)
      let isStackDeleted = false

      if (!this.isProtectedBranch(branchVersionLabel) && this.isStackOlderThan(7, stack)) {
        console.log(`[Current stack] ${StackName}'\n`)

        // Server deploy
        process.stdout.write('[Server deploy] Checking for S3 bucket resources...\t\t\t\t')
        let stackS3Resource
        try {
          stackS3Resource = await this.getStackS3BucketResource(StackName)
        }
        catch (e) {
          console.log('[ERROR] ', e.message)
          if (e.statusCode === 400) {
            console.log('[Server deploy] Probably Stack was deleted by different process few seconds ago')
          }
        }

        if (stackS3Resource) {
          console.log('[OK] Found')
          const bucket = stackS3Resource.PhysicalResourceId
          process.stdout.write('[Server deploy] Checking for S3 bucket content...\t\t\t\t')
          let contentKeys
          try {
            contentKeys = await this.getS3BucketContentsKeys(bucket)
          }
          catch (e) {
            console.log('[ERROR] There is no S3 bucket')
          }

          if (contentKeys) {
            if (this.s3BucketHasContent(contentKeys)) {
              console.log('[OK] Found')
              process.stdout.write('[Server deploy] Deleting S3 bucket content...\t\t\t\t\t')
              try {
                      await this.deleteS3BucketContents(bucket, contentKeys)
                console.log('[OK] Done')
              }
              catch (e) {
                console.log('[ERROR] There is a problem deleting content')
              }
            }
            else console.log('[OK] S3 bucket is empty')
          }
        }
        else console.log('[Server deploy] There is no S3 bucket resources')

        process.stdout.write(`[Server deploy] Deleting stack deploy...\t\t\t\t\t`)
        try {
            await this.deleteStack(StackName)
          console.log('[OK] Done\n')
          isStackDeleted = true
        }
        catch (e) {
          console.log('[ERROR] There is problem deleting stack')
        }

        if (isStackDeleted) {
          // Server DB
          process.stdout.write('[Server DB] Trying to connect to Mongo db...\t\t\t\t\t')
          if (this.isMongoUrlExist()) {
            try {
              await this.connectToDatabase(branchVersionLabel)
              console.log('[OK] Connected')
            }
            catch (e) {
              console.log('[ERROR] Can\'t connect to db')
            }

            if (this.isConnectedToDb()) {
              process.stdout.write('[Server DB] Dropping database...\t\t\t\t\t\t')
              try {
                await this.dropDatabase(`CI_${branchVersionLabel}`)
                console.log('[OK] Done')
              }
              catch (e) {
                console.log('[ERROR] There is problem deleting db')
              }
              this.closeDbConnection()
            }
          }
          else console.log('[ERROR] There is no Mongo url present in system environment')
        }

        // Web deploy
        process.stdout.write('\n[Web deploy] Checking for Web deployment...\t\t\t\t\t')
        let webDeploymentContentKeys
        const webDeploymentBucket = `thebrain-web-${branchVersionLabel}`
        try {
          webDeploymentContentKeys = await this.getS3BucketContentsKeys(webDeploymentBucket)
        }
        catch (e) {
          console.log('[ERROR] There is no Web deployment')
        }

        if (webDeploymentContentKeys) {
          if (this.s3BucketHasContent(webDeploymentContentKeys)) {
            console.log('[OK] Found')
            process.stdout.write('[Web deploy] Deleting S3 bucket content...\t\t\t\t\t')
            try {
              await this.deleteS3BucketContents(webDeploymentBucket, webDeploymentContentKeys)
              console.log('[OK] Done')
            }
            catch (e) {
              console.log('[ERROR] There is a problem deleting content')
            }
          }
          else console.log('[OK] S3 bucket is empty')
        }

        process.stdout.write(`[Web deploy] Deleting web deploy...\t\t\t\t\t\t`)
        try {
          await this.deleteS3Bucket(webDeploymentBucket)
          console.log('[OK] Done')
        }
        catch (e) {
          console.log('[ERROR] ', e.message)
        }

        console.log('\n---\n')
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
  }

  async closeDbConnection () {
    await this.db.close()
    this.db = undefined
  }

  isConnectedToDb () {
    return this.db !== undefined
  }

  updateProtectedBranches () {
    this.protectedBranches = this.protectedBranches.map(protectedBranch => {
      const truncatedBranchName = protectedBranch.substr(0, 14)
      const md5Hash = this.generateMd5Hash(protectedBranch)
      return `${truncatedBranchName}-${md5Hash}`
    })
  }

  generateMd5Hash (string) {
    return crypto.createHash('md5').update(`${string}\n`).digest('hex').substr(0, 7)
  }

  isProtectedBranch (branchVersionLabel) {
    return this.protectedBranches.indexOf(branchVersionLabel) > -1 || branchVersionLabel === this.buildVersionLabel
  }

}

const cleanDeployments = new CleanDeployments()
cleanDeployments.clean()
