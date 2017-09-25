const axios = require('axios')
const db = require('./db_connect')

module.exports = (req, res) => {
	const locationId = '58P3G71RRP0YY'
	axios.get(
		`https://connect.squareup.com/v2/locations/${ locationId }/transactions/${ req.body.entity_id }`,
		{ headers: { 'Authorization': 'Bearer ' + process.env.SQUARE_SK } } 
	).then(({ data }) => {
		res.json(data)
		console.log(data)

		// const values = [
		// 	customerName,
		// 	zipCode,
		// 	email,
		// 	stripeId,
		// 	numberOfTickets,
		// 	expectedPrice * 100,
		// 	timeSlotId,
		// 	promoCodeId,
		// 	Date.now() + '' + Math.floor(Math.random() * 1000000000000),
		// 	Math.floor(Date.now() / 1000)
		// ]

		// db.query(`INSERT INTO transactions (
		// 	customer_name, 
		// 	zip_code, 
		// 	email,  
		// 	number_of_tickets, 
		// 	amount_paid, 
		// 	time_slot_id, 
		// 	promo_code_id, 
		// 	qr_code, 
		// 	transaction_timestamp
		// ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, values)

	}, () => res.json({ error: 'Server error' }))
}
