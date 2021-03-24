'use strict'

const { get } = require('env-var')

module.exports = {
  LOG_LEVEL: get('LOG_LEVEL').default('info').asString(),
  HTTP_PORT: get("HTTP_PORT").default(8080).asPortNumber(),
  KAFKA_CLIENT_ID: get('KAFKA_CLIENT_ID').default('order-producer').asString(),
  KAFKA_TOPIC: get('KAFKA_TOPIC').default('orders').asString(),
  KAFKA_SVC_USERNAME: get('KAFKA_SVC_USERNAME').example('srvc-acct-abc123-xyz').required().asString(),
  KAFKA_SVC_PASSWORD: get('KAFKA_SVC_PASSWORD').required().asString(),
  KAFKA_BOOTSTRAP_URL: get('KAFKA_BOOTSTRAP_URL').example('kafka-instance-abcxyz.kafka.devshift.org:443').required().asString()
}
