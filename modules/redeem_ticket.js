require('dotenv').config()

const db = require('./db_connect')
const moment = require('moment')

module.exports = (req, res) => {
	const now = Math.floor(Date.now() / 1000)
	const query = `
		SELECT  transactions.*, time_slots.start_time, time_slots.end_time
		FROM transactions transactions
		INNER JOIN time_slots time_slots ON transactions.time_slot_id = time_slots.id
		WHERE transactions.qr_code = $1
	`
	db.query(query, [ req.body.qrCode ]).then(response => {
		const transaction = response.rows[0]
		if (!transaction) {
			res.json({ error: 'Ticket could not be found!' })
		} else {
			if (transaction.redeemed_timestamp) {
				res.json({ error: 'Ticket has already been redeemed!' })
			} else if (!req.body.forceRedeem && !(transaction.start_time < now && transaction.end_time > now)) {
				res.json({ 
					error: `This ticket is for ${
						moment.unix(transaction.start_time).tz('America/Denver').format('dddd, MMM Do')
					} from ${
						moment.unix(transaction.start_time).tz('America/Denver').format('h:mma') + ' - ' +
						moment.unix(transaction.end_time).tz('America/Denver').format('h:mma')
					}. Would you like to redeem it anyways?`,
					invalidTimeSlot: true
				})
			} else {
				db.query('UPDATE transactions SET redeemed_timestamp = $1 WHERE id = $2', [ now, transaction.id ])
					.then(() => {
						res.json({ 
							name: transaction.customer_name, 
							numberOfTickets: transaction.number_of_tickets
						})
					}).catch(() => res.json({ error: 'Server error, please try again.' }))
			}
		}
	}).catch(() => res.json({ error: 'Server error, please try again.' }))
}
