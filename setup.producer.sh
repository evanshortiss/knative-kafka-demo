#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
NAMESPACE=${NAMESPACE:-knative-kafka-producer}

if [[ -z "${OCM_TOKEN}" ]]; then
  echo "Please set OCM_TOKEN environment variable using a token from cloud.redhat.com/openshift/token"
  exit 1
fi

if [[ -z "${KAFKA_INSTANCE}" ]]; then
  echo "Please set KAFKA_INSTANCE environment variable to the name of the Kafka instance you will be using"
  exit 1
fi

oc new-project $NAMESPACE

# Create the necessary Pipeline, PVC, Trigger, GitHub Secret
# and EventListener (for GitHub webhook to POST to)
oc process -f "${DIR}/producer/openshift/pipelines.pipeline.yml" -p NAMESPACE=$NAMESPACE | oc create -f -

# Create a deployment that uses the image output by the Pipeline
oc process -f "${DIR}/producer/openshift/deployment.producer.yml" -p NAMESPACE=$NAMESPACE | oc create -f -

# Expose a HTTPS route to the GitHub webhook POST endpoint
oc create route edge --service el-event-listener-github

# Choose a Kafka instance and link it into the project
rhoas kafka use $KAFKA_INSTANCE
rhoas cluster connect --yes --token=$OCM_TOKEN

# Apply a service binding to bind Kafka variables into the producer application
oc apply -f "${DIR}/producer/openshift/servicebinding.yml"

# Kick off an initial build of the producer
tkn pipeline start producer --use-param-defaults --workspace name=workspace,claimName=workspace-claim

echo -n "Done!"
echo ""

SECRET=$(oc get secret producer-github-webhook-secret -o jsonpath='{.data.WebHookSecretKey}' | base64 -D)
ROUTE=$(oc get route el-event-listener-github -o jsonpath={.spec.host})
echo "Setup a GitHub webhook using the following configuration."
echo "This will trigger the a pipeline run on a git push."
echo ""
echo "Payload URL: https://${ROUTE}"
echo "Secret: ${SECRET}"
echo "Content type: application/json"
