'use strict'

const { HTTP_PORT } = require('./config')
const generateOrder = require('./generate.order')
const kafka = require('./kafka')
const log = require('./log')
const path = require('path')
const fastify = require('fastify')({
  logger: log
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

fastify.get('/', (request, reply) =>  {
  return reply.sendFile('index.html')
})

fastify.get('/order', async (request, reply) => {
  const order = generateOrder()

  fastify.log.debug('generated order: %j', order)

  await kafka.send(order)

  fastify.log.info('order submit success')

  reply.send({
    status: 'order sent successfully',
    order
  })
})

fastify.listen(HTTP_PORT, '0.0.0.0', (err) => {
  if (err) throw err
})
