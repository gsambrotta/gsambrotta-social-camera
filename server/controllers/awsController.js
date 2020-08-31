const AWS = require('aws-sdk')

function awsConfig() {
  const config = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
  }
  AWS.config.update(config)

  const S3 = new AWS.S3({
    // signatureVersion: 'v4',
    params: { Bucket: process.env.S3_BUCKET_NAME },
  })

  return { S3 }
}

exports.getPresignedUrl = async (req, res) => {
  const { S3 } = awsConfig()
  const { id } = req.body

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `giorgia/${id}/avatar.jpg`,
    Expires: 15 * 60, // 15 minutes
  }
  const url = await S3.getSignedUrlPromise('getObject', params)
  if (url.error) {
    return res.status(400).send('error creating get presigned url')
  } else {
    return res.status(200).send({ getSignedUrl: url })
  }
}

exports.putPresignedUrl = async (req, res) => {
  const { S3 } = awsConfig()
  const { contentType, id } = req.body

  if (!contentType.startsWith('image/')) {
    throw new Error('must be image/')
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `giorgia/${id}/avatar.jpg`,
    Expires: 15 * 60, // 15 minutes
    ContentType: contentType,
    ContentEncoding: 'base64',
  }
  const url = await S3.getSignedUrlPromise('putObject', params)

  if (url.error) {
    return res.status(400).send('error creating put presigned url')
  } else {
    res.status(200).send({ putSignedUrl: url })
  }
}
