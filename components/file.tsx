import React from 'react'
import { S3File } from '../clients/s3Client'
import styles from './file.module.css'

export default (props: S3File) => {
  return (
    <>
      <a href={props.url} download className={styles.fileName} target="_blank">
        {props.name}
      </a>
      <span className={styles.fileSize}>{Math.ceil(props.size / 1000)} kb</span>
    </>
  )
}