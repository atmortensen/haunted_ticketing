require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_SK),
      db = require('./db_connect')

module.exports = {}

module.exports.get_all = (req, res) => {

}

module.exports.create = (req, res) => {
  const { 
    customerName, 
    zipCode, 
    email, 
    stripeToken, 
    numberOfTickets,
    expectedPrice,
    promoCodeId,
    timeSlotId
  } = req.body
  console.log(
    customerName, 
    zipCode, 
    email, 
    stripeToken, 
    numberOfTickets,
    expectedPrice,
    promoCodeId,
    timeSlotId
  )
  // Get promo code
  // Get time slot
  // Check that all values exist besides zidCode and promoCode
  // Check that numberOfTickets is >= to promoCode minimum purchase
  // Check that numberOfTicket is <= timeSlot tickets purchased - tickets available
  // Check that expected price === calculated price
  // Make Stripe payment
  // Save to postgres return transaction 
  // Send email
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