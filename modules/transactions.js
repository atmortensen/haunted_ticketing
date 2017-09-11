require('dotenv').config()
const valid = require('validator')
      sgMail = require('@sendgrid/mail')

const stripe = require('stripe')(process.env.STRIPE_SK),
      db = require('./db_connect')

module.exports = {}

module.exports.get_all = (req, res) => {
  res.send('Coming Soon')
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
        AND redeemed_timestamp IS NOT NULL
      ) AS number_redeemed
      FROM time_slots
      WHERE NOT deleted
      AND id = $1;
  `
  
  // GET TIME SLOT AND PROMO CODE
  if (!timeSlotId) {
    res.json({ error: 'Time slot must be selected. Try reloading the page.'})
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
    }).catch(e => console.log(e))
  }

  // VALIDATE PAYLOAD
  function validate() {
    if (!customerName || !email || !numberOfTickets || !expectedPrice) {
      res.json({ error: 'Please fill all required fields.' })
    } else if (!stripeToken) {
      res.json({ error: 'Error processing payment.' })
    } else if (!valid.isEmail(email)) {
      res.json({ error: 'Please enter a valid email.' })
    } else if (!valid.isInt(String(numberOfTickets), {min: 1})) {
      res.json({ error: 'Ticket quantity must be a number greater than 0.' })
    } else if (timeSlot.number_available - timeSlot.number_sold < numberOfTickets) {
      let message
      if (timeSlot.number_available - timeSlot.number_sold > 0) {
        message = `There are only ${timeSlot.number_available - timeSlot.number_sold} tickets available for purchase in this time slot.`
      } else {
        message = 'This time slot is sold out. Please choose a different one.'
      }
      res.json({ error: message })
    } else if (promoCode && promoCode.minimum_purchase > numberOfTickets) {
      res.json({ error: `You must purchase at least ${promoCode.minimum_purchase} tickets to use this promo code.` })
    } else if (
      ( (numberOfTickets * 24) - (promoCode ?
        (numberOfTickets * (promoCode.fixed_discount / 100)) :
        0) ).toFixed(2) !== expectedPrice
    ) {
      res.json({ error: 'Charge amount dispute. Please contact us at support@hauntedticketing.com' })
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
    function saveTransaction(stripeId) {
      const data = [
        customerName,
        zipCode,
        email,
        stripeId,
        numberOfTickets,
        expectedPrice * 100,
        timeSlotId,
        promoCodeId,
        Date.now() + '' + Math.floor(Math.random() * 1000000000000),
        Math.floor(Date.now() / 1000)
      ]

      db.query(`INSERT INTO transactions (
        customer_name, 
        zip_code, 
        email, 
        stripe_transaction_id,  
        number_of_tickets, 
        amount_paid, 
        time_slot_id, 
        promo_code_id, 
        qr_code, 
        transaction_timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, data).then(response => {
        sendEmail(response.rows[0])
        res.json(response.rows[0])
      }).catch(e => res.json({ error: 'Critical error! Your card was charged, but there was a server error. Please contact us at support@hauntedticketing.com' }))
    }

    function sendEmail(transaction) {
      sgMail.setApiKey(process.env.SENDGRID_SK)
      const msg = {
        to: transaction.email,
        from: 'Haunted Ticketing <support@hauntedticketing.com>',
        subject: 'Your tickets for the Haunted Mansions of Albion',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
      sgMail.send(msg)
      .then()
      .catch(e => console.log(e))
    }

  }

}

module.exports.update = (req, res) => {
  res.send('Coming Soon')
  // Mark transaction as redeemed
  // Checks: is the time slot correct, is the qr code valid
}
