const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      auth = require('./modules/auth'),
      qr = require('./modules/qr_code'),
      time_slots = require('./modules/time_slots'),
      promo_codes = require('./modules/promo_codes'),
      transactions = require('./modules/transactions')

require('dotenv').config()
require('newrelic')
// HTTPS redirect
app.use((req, res, next) => {
  console.log(req.secure)
//   if (process.env.DEV || req.secure) {
//     return next()
//   } else {
//     res.redirect(`https://${req.hostname}${req.url}`)
//   }
})
console.log(req.secure)
app.use(cors())
app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/front_end/build'))

// UNCOMMENT NEXT LINE TO RESET DB
// require('./modules/db_setup')

// QR CODE GENERATOR
app.get('/api/qr/:data', qr.get)

// LOGIN
app.post('/api/login', auth.login)
app.get('/api/hash/:password', auth.hash)

// TIME SLOTS
app.get('/api/time_slots', time_slots.get_all)
app.post('/api/time_slot', auth.admin_route, time_slots.create)
app.delete('/api/time_slot/:id', auth.admin_route, time_slots.delete)

// PROMO CODES
app.get('/api/promo_codes', auth.admin_route, promo_codes.get_all)
app.get('/api/promo_code/:code', promo_codes.get)
app.post('/api/promo_code', auth.admin_route, promo_codes.create)
app.delete('/api/promo_code/:id', auth.admin_route, promo_codes.delete)

// TRANSACTIONS
app.get('/api/transactions', auth.admin_route, transactions.get_all)
app.post('/api/transaction', transactions.create)
app.put('/api/transaction/:id/:qr-code', auth.admin_route, transactions.update)

// FRONT END REACT
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/front_end/build/index.html')
})

// LISTENER
app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'))
})