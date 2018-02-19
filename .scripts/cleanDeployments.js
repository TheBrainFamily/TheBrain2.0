const AWS = require('aws-sdk')
const MongoClient = require('mongodb')

// ------

const BranchHelper = require('./helpers/branchHelper')
const DbHelper = require('./helpers/dbHelper')
const CloudFormationHelper = require('./helpers/cloudFormationHelper')
const S3Helper = require('./helpers/s3Helper')

AWS.config.update({region: 'us-east-1'})

// ------

const branchHelper = new BranchHelper()
branchHelper.addProtectedBranch('master')
branchHelper.addProtectedBranch('develop')
branchHelper.updateProtectedBranches()

const dbHelper = new DbHelper(MongoClient)

const cloudFormationHelper = new CloudFormationHelper(new AWS.CloudFormation())

const s3Helper = new S3Helper(new AWS.S3())

// ------

class CleanDeployments {
  async clean () {
    const stacks = await cloudFormationHelper.getStacks()
    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i]
      const {StackName} = stack
      const branchVersionLabel = branchHelper.getBranchVersionLabel(StackName)
      let isStackDeleted = false

      if (!branchHelper.isProtectedBranch(branchVersionLabel) && cloudFormationHelper.isStackOlderThan(7, stack)) {
        console.log(`[Current stack] ${StackName}'\n`)

        // Server deploy
        process.stdout.write('[Server deploy] Checking for S3 bucket resources...\t\t\t\t')
        let stackS3Resource
        try {
          stackS3Resource = await cloudFormationHelper.getStackS3BucketResource(StackName)
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
            contentKeys = await s3Helper.getS3BucketContentsKeys(bucket)
          }
          catch (e) {
            console.log('[ERROR] There is no S3 bucket')
          }

          if (contentKeys) {
            if (s3Helper.s3BucketHasContent(contentKeys)) {
              console.log('[OK] Found')
              process.stdout.write('[Server deploy] Deleting S3 bucket content...\t\t\t\t\t')
              try {
                // await s3Helper.deleteS3BucketContents(bucket, contentKeys)
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
          // await cloudFormationHelper.deleteStack(StackName)
          console.log('[OK] Done\n')
          isStackDeleted = true
        }
        catch (e) {
          console.log('[ERROR] There is problem deleting stack')
        }

        if (isStackDeleted) {
          // Server DB
          process.stdout.write('[Server DB] Trying to connect to Mongo db...\t\t\t\t\t')
          if (dbHelper.isMongoUrlExist()) {
            try {
              await dbHelper.connectToDatabase(branchVersionLabel)
              console.log('[OK] Connected')
            }
            catch (e) {
              console.log('[ERROR] Can\'t connect to db')
            }

            if (dbHelper.isConnectedToDb()) {
              process.stdout.write('[Server DB] Dropping database...\t\t\t\t\t\t')
              try {
                // await dbHelper.dropDatabase(`CI_${branchVersionLabel}`)
                console.log('[OK] Done')
              }
              catch (e) {
                console.log('[ERROR] There is problem deleting db')
              }
              dbHelper.closeDbConnection()
            }
          }
          else console.log('[ERROR] There is no Mongo url present in system environment')
        }

        // Web deploy
        process.stdout.write('\n[Web deploy] Checking for Web deployment...\t\t\t\t\t')
        let webDeploymentContentKeys
        const webDeploymentBucket = `thebrain-web-${branchVersionLabel}`
        try {
          webDeploymentContentKeys = await s3Helper.getS3BucketContentsKeys(webDeploymentBucket)
        }
        catch (e) {
          console.log('[ERROR] There is no Web deployment')
        }

        if (webDeploymentContentKeys) {
          if (s3Helper.s3BucketHasContent(webDeploymentContentKeys)) {
            console.log('[OK] Found')
            process.stdout.write('[Web deploy] Deleting S3 bucket content...\t\t\t\t\t')
            try {
              // await s3Helper.deleteS3BucketContents(webDeploymentBucket, webDeploymentContentKeys)
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
          // await s3Helper.deleteS3Bucket(webDeploymentBucket)
          console.log('[OK] Done')
        }
        catch (e) {
          console.log('[ERROR] ', e.message)
        }

        console.log('\n---\n')
      }
    }
  }
}

const cleanDeployments = new CleanDeployments()
cleanDeployments.clean()
