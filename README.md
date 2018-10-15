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


# Rendering Graphs in the UI

There are various approaches to visualize the data in Elasticsearch for the end-users of the UI application. 

### Integrate Kibana in the UI application

Charts are created in Kibana then they are injected into the UI. 

#### Injecting charts with HTML iframe
In this approach Kibana needs to be exposed to the Internet as the end-user needs to view charts rendered by Kibanain. This method brings challenges in terms of handling authentication and authorization due to the fact that users need to be authenticated with Kibana as well as the UI.

#### Proxy Kibana via the UI
The UI proxies Kibana so the end-users only interact with the UI. As charts are still rendered in Kibana, there might be limitations on customizing the look and feel of the charts.


### Rendering Chart by data from Elasticsearch
The UI fetches data from Elasticsearch and renders it using libraris like D3. This approach gives us the most flexibility in terms of customizing our charts and graphs. As an example visit http://www.cotrino.com/starpaths/

