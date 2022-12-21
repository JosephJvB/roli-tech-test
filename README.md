### Setup
1. ~~clone the repository: `git clone`~~
1. unzip the folder provided
2. install dependencies: `cd roli-tect-test && npm i`
3. update .env.local with your S3 bucket name, and the s3 bucket region
4. ensure your default AWS profile credentials have permission to access the private S3 Bucket that the app will read from.
  - EG: `~/.aws/credentials`
```txt
[default]
aws_access_key_id = <access key id>
aws_secret_access_key = <secret access key>
```
  - Why use AWS credentials file? Prefer to not initialize AWS.S3 client with AWS key credentials
  - If this app were running in the cloud, I would choose to use AWS IAM roles to allow private S3 bucket read permissions
4. `npm run dev` && open https://localhost:3000


### TASK


Create a simple React and Node.js application that acts as a file browser for a private AWS S3 bucket. Only the objects at the root of the bucket are needed for this task.


It should:
- [x] List the objects at the root (no prefixes) as well as the available prefixes
  - listObjectsV2
- [x] Present a download link for each object that downloads the file from S3
  - getSignedUrlPromise
- [x] Include a simple README.md explaining how to set up the application to run locally and read from any private S3 bucket

### Stretch:
- [] use graphQL
- [x] allow nested folder browsing
- [x] return filesize
- [] dynamic bucketname from user input
- [] dynamic region
- [] mobile styling