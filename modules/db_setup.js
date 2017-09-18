const db = require('./db_connect')

const query = `
DROP TABLE IF EXISTS transactions, promo_codes, time_slots;
CREATE TABLE promo_codes (
	id SERIAL PRIMARY KEY NOT NULL,
	code TEXT NOT NULL,
	fixed_discount INTEGER,
	minimum_purchase INTEGER,
	deleted BOOLEAN DEFAULT false NOT NULL
);
CREATE TABLE time_slots (
	id SERIAL PRIMARY KEY NOT NULL,
	start_time INTEGER NOT NULL,
	end_time INTEGER NOT NULL,
	number_available INTEGER,
	deleted BOOLEAN DEFAULT FALSE NOT NULL
);
CREATE TABLE transactions (
	id SERIAL PRIMARY KEY NOT NULL,
	customer_name TEXT,
	zip_code TEXT,
	email TEXT,
	stripe_transaction_id TEXT,
	square_transaction_id TEXT,
	number_of_tickets INTEGER NOT NULL,
	amount_paid INTEGER,
	time_slot_id INTEGER REFERENCES time_slots NOT NULL,
	promo_code_id INTEGER REFERENCES promo_codes,
	qr_code TEXT,
	redeemed_timestamp INTEGER,
	transaction_timestamp INTEGER
);
`

db.query(query, err => {
	if (err) {
		console.log(err)
		console.log('db setup - fail')
	} else {
		console.log('db setup - success')
	}
})

