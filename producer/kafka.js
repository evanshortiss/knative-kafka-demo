'use strict'

const log = require('./log')
const { Kafka } = require('kafkajs')
const { KAFKA_BOOTSTRAP_URL, KAFKA_CLIENT_ID, KAFKA_TOPIC, KAFKA_SVC_USERNAME, KAFKA_SVC_PASSWORD } = require('./config')

const kafka = new Kafka(getKafkaConfig())
const producer = kafka.producer()

/**
 * Send an order to Kafka.
 * Orders are keyed using the customer email.
 * @param {Order} order
 */
exports.send = async (order) => {
  await producer.connect()

  const msg = {
    key: order.email,
    value: JSON.stringify(order)
  }

  log.debug('sending message to kafka: %j', msg)

  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [msg]
  })
}

/**
 * Generates a KafkaConfig.
 * If a Kafka username and password are configured it uses SSL and SASL PLAIN.
 * @returns {KafkaConfig}
 */
function getKafkaConfig () {
  const config = {
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BOOTSTRAP_URL]
  }

  if (KAFKA_SVC_USERNAME && KAFKA_SVC_PASSWORD) {
    log.info('Found KAFKA_SVC_USERNAME and KAFKA_SVC_PASSWORD in the environment. Enabling SSL and SASL PLAIN')
    config.ssl = true
    config.sasl = {
      mechanism: 'plain',
      username: KAFKA_SVC_USERNAME,
      password: KAFKA_SVC_PASSWORD
    }
  }

  log.debug('kafka connection config: %j', config)

  return config
}
