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

oc process -f "${DIR}/crs/pipelines.pipeline.yml" -p NAMESPACE=$NAMESPACE | oc create -f -
oc process -f "${DIR}/crs/deployment.producer.yml" -p NAMESPACE=$NAMESPACE | oc create -f -
oc create route edge --service el-event-listener-github

rhoas kafka use $KAFKA_INSTANCE
rhoas cluster connect --yes --token=$OCM_TOKEN

oc apply -f "${DIR}/crs/servicebinding.yml"
