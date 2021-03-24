# OpenShift Dedicated Knative Kafka Demo

## Requirements

* Docker (for local development)
* [Func (`func`)](https://github.com/boson-project/func/releases)
* [OpenShift CLI (`oc`)](https://docs.openshift.com/dedicated/4/cli_reference/openshift_cli/getting-started-cli.html)
* OpenShift Dedicated (OSD) v4.6 Cluster
* OpenShift Serverless v1.12 Operator installed on OSD
* A Kafka instance with SASL configured

## Local Development

See instructions in the *producer/* and *consumer/* folders.

## Usage

Follow and complete the *Deployment on OpenShift Dedicated* instructions
before continuing with this section.

### Kafkacat

Start a Kafkacat session:

```bash
export KAFKA_SVC_USERNAME=kafka-username
export KAFKA_SVC_PASSWORD=super-strong-password
export KAFKA_BOOTSTRAP_URL=kafka-instance-abcxyz.kafka.devshift.org:443
export TOPIC=orders

kafkacat -t $TOPIC -b $KAFKA_BOOTSTRAP_URL \
-X security.protocol=SASL_SSL -X sasl.mechanisms=PLAIN \
-X sasl.username=$KAFKA_SVC_USERNAME \
-X sasl.password=$KAFKA_SVC_PASSWORD -P
```

You can now copy and paste the *consumer/order.oneline.json* into Kafkacat to
send orders to the Kafka instance. These are then processed by the Knative
Quarkus application on OpenShift Dedicated.

Use `CTRL+D` keys to close the Kafkacat session.

### Node.js Producer Application

Start the producer included in this repository. This requires Node.js v14 and
npm v6:

```bash
export KAFKA_SVC_USERNAME=srvc-acct-abc123-xyz
export KAFKA_SVC_PASSWORD=super-strong-password
export KAFKA_BOOTSTRAP_URL=kafka-instance-abcxyz.kafka.devshift.org:443

cd producer
npm install
npm start
```

You can now create randomised orders via GET requests to
`http://localhost:8080/order`.

### Viewing Order Processing (Consumer Logs)

The consumer Pod logs can be viewed on using the `oc` CLI or via the
OpenShift Dedicated console.

![Consumer Logs](/screenshots/consumer-logs.png)


## Deployment on OpenShift Dedicated

### Red Hat OpenShift Serverless Configuration

Login to your OpenShift Dedicated cluster and install the
**Red Hat OpenShift Serverless** Operator.

![Installing the Serverless Operator](/screenshots/knative-install.png)

After the Operator has finished installing, navigate to the `knative-serving`
project and create a *KnativeServing* instance with default settings.

![Create a KnativeServing Instance](/screenshots/knative-serving-setup.png)

Navigate to the `knative-eventing` project and create a *KnativeEventing*
instance using the default settings. In this same project, create a
*KnativeKafka* instance with the *Source* option enabled.

![Create a KnativeKafka Instance](/screenshots/knative-kafka-setup.png)

The `knative-eventing` namespace should contain the following instances when
you've finished:

![Create a knative-eventing Instances](/screenshots/knative-eventing-instances.png)



### Consumer Project Setup

Log into the OpenShift (`oc`) CLI and create a project.

```bash
# Obtain a login token and API server URL from your OpenShift cluster
oc login --token=$TOKEN --server=$SERVER

export PROJECT_NAME=summit-demo
oc new-project $PROJECT_NAME
```

Now, deploy the serverless function into your project.

```bash
cd consumer/
cp func.template.yaml func.yaml

# Edit the func.yaml "namespace" to reflect the name of your project
# on the openshift dedicated cluster. You also need to change the image
# registry URL to one you can push a container image to.

func deploy
```

Create a Secret containing the Kafka Connection details then create a Kafka
Source that uses it:

```bash
rhoas login
rhoas use <your-cluster-name>
rhoas cluster connect

KAFKA_BOOTSTRAP_URL=kafka-instance-abcxyz.kafka.devshift.org:443

oc process -f knative/kafka.template.yml \
-p KAFKA_BOOTSTRAP_URL="${KAFKA_BOOTSTRAP_URL}" | oc create -f -
```
