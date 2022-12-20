import React from 'react'
import { S3File } from '../pages/api/s3/root'
import styles from './file.module.css'

export default (props: S3File) => {
  function openDownloadUrl() {
    window?.open(props.url, '_blank')?.focus()
  }
  return (
    <span className={styles.file} onClick={openDownloadUrl}>
      {props.name}
    </span>
  )
}