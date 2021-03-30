#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
NAMESPACE=${NAMESPACE:-game-event-handlers}
IMAGE=${IMAGE:-quay.io/evanshortiss/summit-2021-quarkus-funq}

if [[ -z "${OCM_TOKEN}" ]]; then
  echo "Please set OCM_TOKEN environment variable using a token from cloud.redhat.com/openshift/token"
  exit 1
fi

if [[ -z "${KAFKA_INSTANCE}" ]]; then
  echo "Please set KAFKA_INSTANCE environment variable to the name of the Kafka instance you will be using"
  exit 1
fi

oc new-project $NAMESPACE

# Create func.yaml from template, and prepend a namespace key/value to it
echo -e "namespace: ${NAMESPACE}\nimage: ${IMAGE}\n$(cat consumer/func.template.yaml)" > consumer/func.yaml

# Build, push, and deploy the serverless function
func build
docker push $IMAGE
kn service create "bonus-scoring" --image $IMAGE -l app.openshift.io/runtime=quarkus


# Inject kafka parameters
rhoas kafka use $KAFKA_INSTANCE
rhoas cluster connect --yes --token=$OCM_TOKEN

# Create the kafka source
# KAFKA_BOOTSTRAP_URL=$(rhoas kafka describe | jq .bootstrapServerHost -r)

# oc process -f $DIR/consumer/openshift/kafkasource.template.yml \
# -p KAFKA_BOOTSTRAP_URL=$KAFKA_BOOTSTRAP_URL | oc create -f -
