import { S3 } from 'aws-sdk'
import { CommonPrefixList, ListObjectsV2Request } from 'aws-sdk/clients/s3'

export type S3File = {
  name: string
  url: string
  size: number
}
export type S3Contents = {
  files: S3File[]
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

  async getObjects(bucket: string, prefix: string = ''): Promise<S3Contents> {
    console.log(
      's3Client.getAllObjects',
      `bucket=${bucket}`,
    )
    const files: S3File[] = []
    const folders: string[] = []
    let continueToken: string | null = null
    do {
      const params: ListObjectsV2Request = {
        Bucket: bucket,
        MaxKeys: 1000,
        Delimiter: '/',
        Prefix: prefix,
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
      // weird issue where if folder in S3 is created manually via AWS Console, that folder is returned as an Object, with Key, and Size=0
      // https://stackoverflow.com/questions/9954521/s3-boto-list-keys-sometimes-returns-directory-key#answer-9960280
      // fix with c.Key != prefix
      for (const c of contents) {
        if (c.Key && c.Key != prefix) {
          files.push({
            name: c.Key,
            url: '',
            size: c.Size || 0,
          })
        }
      }
      continueToken = res.NextContinuationToken || null
    } while (!!continueToken)
    console.log(
      's3Client.getAllObjects',
      `files.length=${files.length}`,
      `folders.length=${folders.length}`,
    )
    return {
      files,
      folders,
    }
  }
}