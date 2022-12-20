import { S3 } from 'aws-sdk'
import { CommonPrefixList, ListObjectsV2Request } from 'aws-sdk/clients/s3'

export type S3Contents = {
  fileKeys: string[]
  folders: string[]
}

export default class S3Client {
  private client: S3
  constructor(public region: string) {
    console.log(
      's3Client.constructor',
      `region=${region}`
    )
    this.client = new S3({ region })
  }

  async getPresignedUrl(bucket: string, key: string, expires: number = 3600): Promise<string> {
    return this.client.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires
    })

  }

  async getRootItems(bucket: string): Promise<S3Contents> {
    console.log(
      's3Client.getAllObjects',
      `bucket=${bucket}`,
    )
    const fileKeys: string[] = []
    const folders: string[] = []
    let continueToken: string | null = null
    do {
      const params: ListObjectsV2Request = {
        Bucket: bucket,
        MaxKeys: 1000,
        Delimiter: '/',
        Prefix: '',
      }
      if (!!continueToken) {
        params.ContinuationToken = continueToken
      }
      const res = await this.client.listObjectsV2(params).promise()
      // handle null
      const contents: S3.ObjectList = res.Contents || [];
      const prefixes: CommonPrefixList = res.CommonPrefixes || []
      for (const p of prefixes) {
        if (p.Prefix) {
          folders.push(p.Prefix)
        }
      }
      for (const c of contents) {
        if (c.Key) {
          fileKeys.push(c.Key)
        }
      }
      continueToken = res.NextContinuationToken || null
    } while (!!continueToken)
    console.log(
      's3Client.getAllObjects',
      `files.length=${fileKeys.length}`,
      `folders.length=${folders.length}`,
    )
    return {
      fileKeys,
      folders,
    }
  }
}