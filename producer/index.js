'use strict'

const { HTTP_PORT, KAFKA_SEND_INTERVAL } = require('./config')
const generateShot = require('./generate.shot')
const kafka = require('./kafka')
const log = require('./log')
const fastify = require('fastify')({
  logger: log
})

let interval

fastify.get('/bonus/clear', (request, reply) => {
  clearInterval(interval)

  reply.send('ok')
})

fastify.get('/bonus/single', async (request, reply) => {
  const shot = generateShot()

  await kafka.send([shot])

  reply.send(shot)
})

fastify.get('/bonus/multi', async (request, reply) => {
  const count = parseInt(request.query.count)

  if (isNaN(count) || count <= 0) {
    reply.status(400).send('the "count" query parameter must be a positive integer')
  } else {
    log.info(`creating interval to send ${count} bonus payloads every ${KAFKA_SEND_INTERVAL}ms`)
    clearInterval(interval)

    interval = setInterval(async () => {
      const shots = []

      for (let i = 0; i <= count; i++) {
        shots.push(generateShot())
      }

      try {
        await kafka.send(shots)
      } catch (e) {
        log.error('error sending shots:')
        log.error(e)
      }
    }, KAFKA_SEND_INTERVAL)

    reply.send('ok')
  }
})

fastify.listen(HTTP_PORT, '0.0.0.0', (err) => {
  if (err) throw err
})
