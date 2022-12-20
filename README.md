### Setup
1. clone the repository: `git clone xx`
2. install dependencies: `cd roli-tect-test && npm i`
3. update .env.local with your S3 bucket name, and the s3 bucket region
4. Ensure your default AWS profile credentials have permission to access the private S3 Bucket that the app will read from.
  - EG: `~/.aws/credentials`
```txt
[default]
aws_access_key_id = <access key id>
aws_secret_access_key = <secret access key>
```
4. 


### TASK


Create a simple React and Node.js application that acts as a file browser for a private AWS S3 bucket. Only the objects at the root of the bucket are needed for this task.


It should:
- [] List the objects at the root (no prefixes) as well as the available prefixes
  - listObjectsV2
- [] Present a download link for each object that downloads the file from S3
  - getSignedUrlPromise
- [] Include a simple README.md explaining how to set up the application to run locally and read from any private S3 bucket

### Stretch:
- [] use graphQL