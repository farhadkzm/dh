After creating a project on Google Cloud and installing gcloud, run the following commands to enable Deployment Manager on the project.
 (Replace `dh-v1-216802` with the actual project id)
```sh
export PROJECT='dh-v1-216802'
gcloud services enable deploymentmanager.googleapis.com --project=$PROJECT
```

Download the deployment script on the machine:

```curl https://raw.githubusercontent.com/farhadkzm/dh/master/k8s.py -L  -o k8s.py```
