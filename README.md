# Setting up the cluster

Checkout this repository on your local machine.

Create a Cloud Project on Google Cloud, install gcloud cli on your machine, and then run the following commands to enable Deployment Manager on the project.
 (Replace `dh-v1-216802` with your project id)
```sh
export PROJECT='dh-v1-216802'
gcloud services enable deploymentmanager.googleapis.com --project=$PROJECT
```

Set up a Kubernetes cluster using Google Deployment Manager (Change NUM_NODES to create a larger cluster with more resources):

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


# Setting up the UI application

To set up and run the ui application on your local machine you need to have access to the Digital Hub cluster.

Download **gcloud cli** and **kubectl** and place them in your system PATH.

Kubectl cli needs credentials to connect to a remote cluster. You need to use gcloud cli to prepare the environment and set the right environment variable (KUBECONFIG) to be used by kubectl.

The following command places the required credentials (Make sure project id is the right one):

```sh
gcloud container clusters get-credentials dh-mini --zone us-west1-a --project dh-v1-216802
```

Now we need to do some port-forwarding magics to make Elasticsearch and Kibana available on your local machine:

```sh
# Kibana port forwarding on port 5601
kubectl port-forward dh-stack-kibana-97464f66d-p6jml 5601:5601  

# Elasticsearch port forwarding on port 9200
kubectl port-forward dh-stack-elasticsearch-client-868d6f98fd-nz8rg 9200:9200
```

Install the UI app dependencies by running **npm install** in ui/app/ and run the app using **node ui/app/app.js**