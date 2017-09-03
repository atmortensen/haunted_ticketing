const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      stripe = require('stripe')(process.env.STRIPE_SK),
      cors = require('cors'),
      { Pool } = require('pg'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs')

require('dotenv').config()
app.use(cors())
app.set('port', process.env.PORT)
app.use(bodyParser.json())
app.use(express.static(__dirname + '/build'))

// DB CONNECT
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: true
})

// ADMIN AUTH MIDDLEWARE
const admin_route = (req, res, next) => {
  jwt.verify(req.header('Authorization'), process.env.JWT_SECRET, err => {
    if (err) {
      res.json({ error: 'Invalid login!' })
    } else {
      next()
    }
  })
}

// LOGIN
app.post('/api/login', (req, res) => {
  if (bcrypt.compareSync(req.body.password, process.env.HASHED_PASSWORD)) {
    res.send(jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.JWT_SECRET))
  } else {
    res.json({ error: 'Incorrect password!' })
  }
})

// TIME SLOTS
app.get('/api/time_slots', (req, res) => {
  
})

app.post('/api/time_slot', admin_route, (req, res) => {
  
})

app.delete('/api/time_slot/:id', admin_route, (req, res) => {
  
})

// PROMO CODES
app.get('/api/promo_codes', (req, res) => {
  
})

app.post('/api/promo_codes', admin_route, (req, res) => {
  
})

app.delete('/api/promo_codes/:id', admin_route, (req, res) => {
  
})

// TRANSACTIONS
app.get('/api/transactions', admin_route, (req, res) => {
  
})

app.post('/api/transaction', (req, res) => {
  // Make stripe payment, enter data into postgres, get qr code, send tickets to email.
})

app.patch('/api/transaction/:id', admin_route, (req, res) => {
  // Mark transaction as redeemed and move transaction to different time slot.
})



app.get('/api/create_tables', (req, res) => {
  const query = `
    DROP TABLE IF EXISTS transactions, promo_codes, time_slots;
    CREATE TABLE promo_codes (
      id SERIAL PRIMARY KEY NOT NULL,
      code TEXT NOT NULL,
      percent_discount INTEGER,
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
      number_of_tickets INTEGER NOT NULL,
      amount_paid INTEGER,
      time_slot_id INTEGER REFERENCES time_slots NOT NULL,
      promo_code_id INTEGER REFERENCES promo_codes,
      redeemed INTEGER
    );
  `
  pool.query(query, err => {
    if (err) {
      res.send('failed')
    } else {
      res.send('success')
    }
  })
})

app.post('/api/test', (req, res) => {
  stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    description: 'Example charge',
    source: req.body.token
  }, (err, charge) => {
    res.json({
      error: err,
      charge
    })
  })
})

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
})

app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'))
})