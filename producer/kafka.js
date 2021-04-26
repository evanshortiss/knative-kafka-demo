'use strict'

const log = require('./log')
const { Kafka } = require('kafkajs')
const { KAFKACONNECTION_BOOTSTRAPSERVERS, KAFKA_CLIENT_ID, KAFKA_TOPIC, KAFKACONNECTION_USER, KAFKACONNECTION_PASSWORD } = require('./config')

const kafka = new Kafka(getKafkaConfig())
const producer = kafka.producer()

/**
 * Send an array of bonus shot payloads to Kafka.
 * @param {Object} shots
 */
exports.send = async (shots) => {
  await producer.connect()

  log.debug('sending shots to kafka: %j', shots)

  await producer.send({
    topic: KAFKA_TOPIC,
    messages: shots.map((shot) => {
      return {
        key: `${shot.match}:${shot.by.uuid}`,
        value: JSON.stringify(shot)
      }
    })
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
    brokers: [KAFKACONNECTION_BOOTSTRAPSERVERS]
  }

  if (KAFKACONNECTION_USER && KAFKACONNECTION_PASSWORD) {
    log.info('Found KAFKACONNECTION_USER and KAFKACONNECTION_PASSWORD in the environment. Enabling SSL and SASL PLAIN')
    config.ssl = true
    config.sasl = {
      mechanism: 'plain',
      username: KAFKACONNECTION_USER,
      password: KAFKACONNECTION_PASSWORD
    }
  }

  log.trace('kafka connection config: %j', config)

  return config
}
