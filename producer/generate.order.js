'use strict'

const faker = require('faker')

/**
 * The definition of a MatchInstance that is pushed to a Kafka topic.
 * @typedef {Object} Product
 * @property {String} department
 * @property {String} price
 * @property {String} quantity
 */

/**
 * The definition of a MatchInstance that is pushed to a Kafka topic.
 * @typedef {Object} Order
 * @property {String} orderId
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} email
 * @property {Object} address
 * @property {Product} product
 * @property {Number} total
 * @property {String} datetime
 */

/**
 * Generates a random order object.
 * @returns {Order}
 */
module.exports = function generateOrder () {
  const firstname = faker.name.firstName()
  const lastname = faker.name.lastName()
  const { address, phone } = faker.helpers.createCard()
  const price = faker.commerce.price()
  const quantity = faker.random.number({
    min: 1,
    max: 10
  })

  return {
    orderId: faker.random.uuid(),
    firstname,
    lastname,
    address: {
      // Hey, it might be a gift so they send it to someone else! :)
      name: Math.random() > 0.85 ? address.streetA : `${firstname} ${lastname}`,
      street: address.streetB,
      unit: address.streetD,
      city: address.city,
      country: address.country,
      zipcode: address.zipcode
    },
    email: faker.internet.email(firstname, lastname, 'example.com'),
    phone,
    product: {
      id: faker.random.uuid(),
      department: faker.commerce.department(),
      price,
      quantity
    },
    total: quantity * price,
    datetime: new Date().toJSON()
  }
}
