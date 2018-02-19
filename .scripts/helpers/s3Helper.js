class S3Helper {
  constructor (s3) {
    this.s3 = s3
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

  deleteS3Bucket (Bucket) {
    return new Promise((resolve, reject) => {
      this.s3.deleteBucket({Bucket}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}

module.exports = S3Helper
