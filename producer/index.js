'use strict'

const { HTTP_PORT } = require('./config')
const generateOrder = require('./generate.order')
const kafka = require('./kafka')
const log = require('./log')
const fastify = require('fastify')({
  logger: log
})

fastify.get('/', (request, reply) => {
  reply.send('hello, fastify')
})

fastify.get('/order', async (request, reply) => {
  const order = generateOrder()

  fastify.log.debug('generated order: %j', order)

  await kafka.send(order)

  fastify.log.info('order submit success')

  reply.send({
    status: 'order submittted successfully',
    order
  })
})

fastify.listen(HTTP_PORT, '0.0.0.0', (err, address) => {
  if (err) throw err
})
