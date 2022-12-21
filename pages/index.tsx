import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import File from '../components/file'
import { S3Contents, S3File } from '../clients/s3Client'
// import { Inter } from '@next/font/google'
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [files, setFiles] = React.useState<S3File[]>([])
  const [folders, setFolders] = React.useState<string[]>([])
  const [prefix, setPrefix] = React.useState<string>('')
  async function loadS3Objects() {
    try {
      const res: Response = await fetch(`/api/objects?prefix=${prefix}`)
      const resBody: S3Contents = await res.json()
      if (!res.ok) {
        throw new Error([
          'loadS3Objects failed',
          `httpStatus=${res.status}`,
          `message=${res.statusText}`,
          `responseBody=${resBody ? JSON.stringify(resBody) : '""'}`
        ].join('\n'))
      }
      setFolders(resBody.folders.map(f => f.replace(prefix, '')))
      setFiles(resBody.files.map(f => ({
        ...f,
        name: f.name.replace(prefix, ''),
      })))
    } catch (e: any) {
      console.error(e)
      console.error('loadS3Objects failed')
      alert(e)
    }
  }
  React.useEffect(() => {
    loadS3Objects()
  }, [prefix])
  function clickFolder(folderName: string) {
    if (folderName == '/') {
      setPrefix('')
      return
    }
    const current = prefix.split('/').filter(p => !!p)
    if (folderName == '..') {
      current.pop()
      let nextPrefix = current.join('/')
      if (nextPrefix.length) {
        nextPrefix += '/'
      }
      setPrefix(nextPrefix)
      return
    }
    current.push(folderName)
    setPrefix(current.join('/'))
  }
  return (
    <>
      <Head>
        <title>Lumi File Browser</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.titleBackground}>
          <h1 className={styles.title}>Lumi File Browser</h1>
        </div>
        <div className={styles.fileExplorer}>
          <div className={styles.sideBar}>
            <div className={styles.buttonContainer}>
              <span className={styles.buttonRed}></span>
              <span className={styles.buttonYellow}></span>
              <span className={styles.buttonGreen}></span>
            </div>
          </div>
          <div className={styles.explorerMain}>
            <div className={styles.explorerTop}>
              <code className={styles.lsCmd}>
                <span className={styles.caret}>{'>'}</span> aws s3 list-objects --region {process.env.NEXT_PUBLIC_S3_REGION} --delimiter '/' --prefix '{prefix}' s3://{process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/
              </code>
            </div>
            <div className={styles.listHeader}>
              <span className={styles.nameHeader}>name</span>
              <span className={styles.sizeHeader}>size</span>
            </div>
            <ul className={styles.list}>
              {prefix.length > 0 && <li className={styles.folder} onClick={() => clickFolder('/')}>/</li>}
              {prefix.length > 0 && <li className={styles.folder} onClick={() => clickFolder('..')}>..</li>}
              {folders.map(folderName => <li className={styles.folder} key={folderName} onClick={() => clickFolder(folderName)} >{folderName}</li>)}
              {files.map(f => <li key={f.name}>
                <File name={f.name} url={f.url} size={f.size}></File>
              </li>)}
            </ul>
            <div className={styles.explorerFooter}>
              <p>{folders.length} folders, {files.length} files</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
