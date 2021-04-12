'use strict'

const { readFileSync, readdirSync } = require('fs')
const { join } = require('path')

const KAFKA_VARNAMES = [
  'KAFKACONNECTION_USER',
  'KAFKACONNECTION_PASSWORD',
  'KAFKACONNECTION_BOOTSTRAPSERVERS'
]

if (process.env.KAFKACONNECTION_BOOTSTRAPSERVERS) {
  module.exports = KAFKA_VARNAMES.reduce((contents, varname) => {
    contents[varname] = process.env[varname]
  }, {})
} else {
  const ALL_BINDINGS_FOLDER_NAME = '/bindings'
  const KAFKA_BINDINGS_FOLDER_NAME = readdirSync(ALL_BINDINGS_FOLDER_NAME)[0]

  module.exports = KAFKA_VARNAMES.reduce((contents, varname) => {
    const filepath = join(ALL_BINDINGS_FOLDER_NAME, KAFKA_BINDINGS_FOLDER_NAME, varname)
    const value = readFileSync(filepath).toString().trim()

    contents[varname] = value

    return contents
  }, {})
}
