import React from 'react'
import { S3File } from '../pages/api/s3/root'

export default (props: S3File) => {
  function openDownloadUrl() {
    window?.open(props.url, '_blank')?.focus()
  }
  return (
    <span className="file" onClick={openDownloadUrl}>
      {props.name}
    </span>
  )
}