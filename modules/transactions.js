require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SK),
      db = require('./db_connect')

module.exports = {}

module.exports.get_all = (req, res) => {

}

module.exports.create = (req, res) => {
  
}

module.exports.update = (req, res) => {
  
}

// Make stripe payment, enter data into postgres, get qr code, send tickets to email.
// Mark transaction as redeemed and move transaction to different time slot.


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