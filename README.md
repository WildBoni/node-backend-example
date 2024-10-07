

### GCP Cloud Storage
- Create new bucket on GCP
- Create new service account on GCP (https://dev.to/kamalhossain/upload-file-to-google-cloud-storage-from-nodejs-server-5cdg)
- Open newly created service account and Create new key
- Download key in JSON format and add it to backend project
- Copy service account email and use it in Cloud Storage Bucket permissions, granting access as Storage Object Creator
- Use Cloud KMS to avoid placing JSON key in GitHub repo

### GCP CLI installation
- WINDOWS: dowload installer
- MAC: https://cloud.google.com/sdk/docs/install#mac