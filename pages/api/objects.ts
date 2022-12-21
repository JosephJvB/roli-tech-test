import type { NextApiRequest, NextApiResponse } from 'next'
import S3Client, { S3Contents, S3File } from '../../clients/s3Client'

export type ApiError = {
  message: string
  stack?: string
  data?: any
}

const s3Client = new S3Client(process.env.NEXT_PUBLIC_S3_REGION!)

export default async function handler(req: NextApiRequest, res: NextApiResponse<S3Contents | ApiError>) {
  try {
    console.log('s3Objects.handler: invoked')
    const prefix: string | undefined = Array.isArray(req.query.prefix) ? req.query.prefix[0] : req.query.prefix
    const { files, folders } = await s3Client.getObjects(process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, prefix)
    const withUrls: S3File[] = await Promise.all(files.map(async (f) => {
      const url = await s3Client.getPresignedUrl(process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, f.name)
      return {
        ...f,
        url,
      }
    }))
    res.status(200).json({
      files: withUrls,
      folders,
    })
    console.log('s3Objects.handler: success')
  } catch (e: any) {
    console.error(e)
    console.error('s3Objects.handler: failed')
    res.status(500).json({
      message: e.message || 'Failed to load S3 Objects',
      stack: e.stack,
    })
  }
}
