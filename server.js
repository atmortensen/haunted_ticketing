const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const auth = require('./modules/auth')
const qr = require('./modules/qr_code')
const timeSlots = require('./modules/time_slots')
const promoCodes = require('./modules/promo_codes')
const createTransaction = require('./modules/create_transaction')
const redeemTicket = require('./modules/redeem_ticket')

require('dotenv').config()
// HTTPS redirect
app.use((req, res, next) => {
	if (process.env.DEV || req.header('x-forwarded-proto') === 'https') {
		return next()
	} else {
		res.redirect(`https://${ req.hostname }${ req.url }`)
	}
})
app.use(cors())
app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/front_end/build'))

// QR CODE GENERATOR
app.get('/api/qr/:data', qr.get)

// LOGIN
app.post('/api/login', auth.login)
app.get('/api/hash/:password', auth.hash)

// TIME SLOTS
app.get('/api/time_slots', timeSlots.getAll)
app.post('/api/time_slot', auth.admin_route, timeSlots.create)
app.delete('/api/time_slot/:id', auth.admin_route, timeSlots.delete)

// PROMO CODES
app.get('/api/promo_codes', auth.admin_route, promoCodes.getAll)
app.get('/api/promo_code/:code', promoCodes.get)
app.post('/api/promo_code', auth.admin_route, promoCodes.create)
app.delete('/api/promo_code/:id', auth.admin_route, promoCodes.delete)

// TRANSACTIONS
app.post('/api/transaction', createTransaction)
app.patch('/api/transaction/redeem', auth.admin_route, redeemTicket)

// FRONT END REACT
app.get('*', (req, res) => {
	res.sendFile(__dirname + '/front_end/build/index.html')
})

// LISTENER
app.listen(app.get('port'), () => {
	console.log('Listening on port ' + app.get('port'))
})
