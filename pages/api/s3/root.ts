import type { NextApiRequest, NextApiResponse } from 'next'
import S3Client, { S3Contents } from '../../../clients/s3Client'

type ApiError = {
  message: string
  stack?: string
  data?: any
}

const s3Client = new S3Client(process.env.S3_REGION!)

export default async function handler(req: NextApiRequest, res: NextApiResponse<S3Contents | ApiError>) {
  try {
    console.log('s3Objects.handler: invoked')
    const allObjects = await s3Client.getRootItems(process.env.S3_BUCKET_NAME!)
    res.status(200).json(allObjects)
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
