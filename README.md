After creating a project on Google Cloud and installing gcloud, run the following commands to enable Deployment Manager on the project.
 (Replace `dh-v1-216802` with the actual project id)
```sh
export PROJECT='dh-v1-216802'
gcloud services enable deploymentmanager.googleapis.com --project=$PROJECT
```

Checkout this git repository and run the Google Deployment Manager script

```sh
export CLUSTER_NAME='dh-mini'
export CLUSTER_ZONE='us-west1-a'

gcloud deployment-manager deployments create ${CLUSTER_NAME} --template=k8s.py  --properties=CLUSTER_NAME:${CLUSTER_NAME},CLUSTER_ZONE:${CLUSTER_ZONE},NUM_NODES:4  --project=$PROJECT
```

Create required user account on the cluster

```sh
kubectl create -f service_account.yaml
```

Prepare helm for the cluster:

```sh
helm init --service-account helm
helm repo add incubator http://storage.googleapis.com/kubernetes-charts-incubator
helm repo update
```

Install Digital stack  
```sh
helm install --name dh-stack digital-stack/
```


