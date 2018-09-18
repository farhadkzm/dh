After creating a project on Google Cloud and installing gcloud, run the following commands to enable Deployment Manager on the project.
 (Replace `dh-v1-216802` with the actual project id)
```sh
export PROJECT='dh-v1-216802'
gcloud services enable deploymentmanager.googleapis.com --project=$PROJECT
```

Download required scripts:

```sh
curl https://raw.githubusercontent.com/farhadkzm/dh/master/k8s.py -L  -o k8s.py
curl https://raw.githubusercontent.com/farhadkzm/dh/master/service_account.yaml -L  -o service_account.yaml
```

Run the downloaded Google Deployment Manager script

```sh
export CLUSTER_NAME='dh-mini'
export CLUSTER_ZONE='us-west1-a'

gcloud deployment-manager deployments create ${CLUSTER_NAME} --template=k8s.py  --properties=CLUSTER_NAME:${CLUSTER_NAME},CLUSTER_ZONE:${CLUSTER_ZONE},NUM_NODES:3  --project=$PROJECT
```

Create required user account on the cluster

```sh
kubectl create -f service_account.yaml
```
