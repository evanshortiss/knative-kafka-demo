'use strict'

const { readFileSync, readdirSync } = require('fs')
const { join } = require('path')

const KAFKA_VARNAMES = [
  'KAFKACONNECTION_USER',
  'KAFKACONNECTION_PASSWORD',
  'KAFKACONNECTION_BOOTSTRAPSERVERS'
]

const KAFKA_BINDING_MAP = {
  KAFKACONNECTION_USER: 'clientId',
  KAFKACONNECTION_PASSWORD: 'clientSecret',
  KAFKACONNECTION_BOOTSTRAPSERVERS: 'bootstrapServers'
}

if (process.env.KAFKACONNECTION_BOOTSTRAPSERVERS) {
  module.exports = KAFKA_VARNAMES.reduce((contents, varname) => {
    contents[varname] = process.env[varname]

    return contents
  }, {})
} else {
  const ALL_BINDINGS_FOLDER_NAME = '/bindings'
  const KAFKA_BINDINGS_FOLDER_NAME = readdirSync(ALL_BINDINGS_FOLDER_NAME)[0]

  module.exports = Object.keys(KAFKA_BINDING_MAP).reduce((contents, varname) => {
    const filepath = join(ALL_BINDINGS_FOLDER_NAME, KAFKA_BINDINGS_FOLDER_NAME, KAFKA_BINDING_MAP[varname])
    const value = readFileSync(filepath).toString().trim()

    contents[varname] = value

    return contents
  }, {})
}
