require('dotenv').config()
const valid = require('validator')

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

  let promoCode
  let timeSlot

  const timeSlotsQuery = `
    SELECT 
      *, 
      ( SELECT COUNT(*) 
        FROM transactions 
        WHERE transactions.time_slot_id = time_slots.id
      ) AS number_sold,
      ( SELECT COUNT(*) 
        FROM transactions 
        WHERE transactions.time_slot_id = time_slots.id 
        AND redeemed IS NOT NULL
      ) AS number_redeemed
      FROM time_slots
      WHERE NOT deleted
      AND id = $1;
  `
  
  // GET TIME SLOT AND PROMO CODE
  if (!timeSlotId) {
    res.json({ error: 'Time slot must be selected.'})
  } else {
    db.query(timeSlotsQuery, [timeSlotId]).then(timeSlotsRes => {
      timeSlot = timeSlotsRes.rows[0]
      if (!timeSlot) {
        res.json({ error: 'Error selecting time slot. Please reload the page and try again.' })
        return
      }
      if (promoCodeId) {
        db.query('SELECT * FROM promo_codes WHERE id = $1', [promoCodeId]).then(promoCodeRes => {
          promoCode = promoCodeRes.rows[0]
          if (!promoCode) {
            res.json({ error: 'Invalid promo code.' })
            return
          }
          validate()
        }).catch(e => res.json({ error: 'Server error, please reload the page and try again.' }))
      } else {
        validate()
      }
    }).catch(e => res.json({ error: 'Server error, please reload the page and try again.' }))
  }

  // VALIDATE PAYLOAD
  function validate() {
    if (!customerName || !email || !numberOfTickets || !expectedPrice) {
      res.json({ error: 'Please fill all required fields.' })
    } else if (!stripeToken) {
      res.json({ error: 'Error processing payment.' })
    } else if (!valid.isEmail(email)) {
      res.json({ error: 'Please enter a valid email.' })
    } else if (timeSlot.number_available - timeSlot.number_sold < numberOfTickets) {
      let message
      if (timeSlot.number_available - timeSlot.number_sold > 0) {
        message = `There are only ${timeSlot.number_available - timeSlot.number_sold} ticket left for this time slot. Please choose a different one.`
      } else {
        message = 'This time slot is sold out. Please choose a different one.'
      }
      res.json({ error: message })
    } else if (promoCode && promoCode.minimum_purchase > numberOfTickets) {
      res.json({ error: `You must purchase at least ${promoCode.minimum_purchase} to use this promo code.` })
    } else if (
      ( (numberOfTickets * 23) - (promoCode ?
        (numberOfTickets * (promoCode.fixed_discount / 100)) :
        0) ).toFixed(2) !== expectedPrice
    ) {
      res.json({ error: 'Charge amount dispute. Please contact us at alextmortensen@gmail.com.' })
    } else {
      pay()
    }
    
    // STRIPE PAYMENT
    function pay() {
      stripe.charges.create({
        amount: expectedPrice * 100,
        currency: 'usd',
        description: 'Haunted Mansions of Albion Admission',
        source: stripeToken
      }, (err, charge) => {
        if (err) {
          res.json({ error: 'Card could not be charged. Please reload the page and try again or contact us.' })
        } else {
          saveTransaction(charge.id)
        }
      })
    }

    // SAVE TRANSACTION TO DATABASE
    function saveTransaction(stripId) {
      const data = [

      ]

      db.query('INSERT INTO transactions', data)
    }

  }

  // Save to postgres return transaction 
  // Send email
}

module.exports.update = (req, res) => {
  // Mark transaction as redeemed
  // Checks: is the time slot correct, is the qr code valid
}


// app.post('/api/test', (req, res) => {
//   
// })