const db = require('./db_connect')

module.exports = {}

module.exports.get_all = (req, res) => {
  db.query('SELECT * FROM promo_codes WHERE NOT deleted')
    .then(r => res.json(r.rows))
    .catch(e => res.json({ error: 'Server error, could not load promo codes.' }))
}

module.exports.get = (req, res) => {
  db.query('SELECT * FROM promo_codes WHERE NOT deleted AND code = $1 LIMIT 1', [req.params.code])
    .then(r => res.json(r.rows[0]))
    .catch(e => res.json({ error: 'Server error, could not find promo codes.' }))
}

module.exports.create = (req, res) => {
  const query = `
    INSERT INTO promo_codes 
    (code, percent_discount, fixed_discount, minimum_purchase) 
    VALUES ($1, $2, $3, $4)
  `
  const values = [ 
    req.body.code, 
    req.body.percent_discount, 
    req.body.fixed_discount, 
    req.body.minimum_purchase
  ]

  db.query(query, values)
    .then(r => res.json({ message: 'Promo code created successfully.' }))
    .catch(e => res.json({ error: 'Server error, could not create promo code.' }))
}

module.exports.delete = (req, res) => {
  db.query('UPDATE promo_codes SET deleted = true WHERE id = $1', [req.params.id])
    .then(r => res.json({ message: 'Promo code deleted successfully.' }))
    .catch(e => res.json({ error: 'Server error, could not delete promo code.' }))
}