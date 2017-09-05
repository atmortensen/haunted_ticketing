require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SK),
      db = require('./db_connect')

module.exports = {}

module.exports.get_all = (req, res) => {

}

module.exports.create = (req, res) => {
  // Make stripe payment, enter data into postgres, get qr code, send tickets to email.
  // Checks: are there tickets available, are they getting enough tickets for the promo code to be valid
}

module.exports.update = (req, res) => {
  // Mark transaction as redeemed
  // Checks: is the time slot correct, is the qr code valid
}


// app.post('/api/test', (req, res) => {
//   stripe.charges.create({
//     amount: 1000,
//     currency: 'usd',
//     description: 'Example charge',
//     source: req.body.token
//   }, (err, charge) => {
//     res.json({
//       error: err,
//       charge
//     })
//   })
// })