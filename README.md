### Setup Steps
1. unzip the folder provided
2. install dependencies: `cd roli-tech-test && npm i`
3. copy example env file: `cp .env.local.example .env.local`
3. Set S3 bucket variables in `.env.local`:
  - NEXT_PUBLIC_S3_BUCKET_NAME = your private S3 bucket __name__
  - NEXT_PUBLIC_S3_REGION = the AWS region which your bucket is in
4. Grant private S3 bucket access with AWS credentials: You __must__ have an AWS Access Key Id and Secret Access Key that grants permissions for your private S3 bucket
  - If your default AWS profile credentials allow access to S3 bucket, the app will work by default
    - Check: mac/linux `~/.aws/credentials` or windows `%USERPROFILE%\.aws\credentials`
```txt
[default]
aws_access_key_id = <access key id>
aws_secret_access_key = <secret access key>
```
  - Or, you can manually set these credentials in .env.local file, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
5. `npm run dev` && open https://localhost:3000


### TASK


Create a simple React and Node.js application that acts as a file browser for a private AWS S3 bucket. Only the objects at the root of the bucket are needed for this task.


It should:
- [x] List the objects at the root (no prefixes) as well as the available prefixes
  - listObjectsV2
- [x] Present a download link for each object that downloads the file from S3
  - getSignedUrlPromise
- [x] Include a simple README.md explaining how to set up the application to run locally and read from any private S3 bucket

### Stretch:
- [ ] use graphQL
- [x] allow nested folder browsing
- [x] return filesize
- [ ] dynamic bucketname from user input
- [ ] dynamic region
- [ ] mobile styling

zip
```sh
zip -r ./roli-test.zip ./roli-tech-test -x "*.DS_Store*" -x "*node_modules*" -x "*.git*" -x "*.next*"
```