import type { NextApiRequest, NextApiResponse } from 'next'
import S3Client, { S3Contents } from '../../../clients/s3Client'

type ApiError = {
  message: string
  stack?: string
  data?: any
}

export type S3File = {
  name: string
  url: string
}
export type S3RootData = {
  folders: string[]
  files: S3File[]
}
const s3Client = new S3Client(process.env.NEXT_PUBLIC_S3_REGION!)

export default async function handler(req: NextApiRequest, res: NextApiResponse<S3RootData | ApiError>) {
  try {
    console.log('s3Objects.handler: invoked')
    const { fileKeys, folders } = await s3Client.getRootItems(process.env.NEXT_PUBLIC_S3_BUCKET_NAME!)
    const withUrls: S3File[] = await Promise.all(fileKeys.map(async (key) => {
      const url = await s3Client.getPresignedUrl(process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, key)
      return {
        name: key,
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
