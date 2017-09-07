const db = require('./db_connect')
const valid = require('validator')

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
  let { code, percent_discount, fixed_discount, minimum_purchase } = req.body
  code = code.toUpperCase().replace(/ /g, '')
  if (fixed_discount) {
    // Convert fixed discount to cents.
    fixed_discount = String(Math.floor(fixed_discount * 100))
  }
  
  // Validate Input
  if (!code || !(percent_discount || fixed_discount)) {
    res.json({ error: 'Please fill all required fields.'})
  } else if (code.length > 10) {
    res.json({ error: '"Code" should be less than 10 characters.'})
  } else if (percent_discount && fixed_discount) {
    res.json({ error: 'Can not used percent and fixed discount together.'})
  } else if (percent_discount && !valid.isInt(percent_discount, {min: 1, max: 100})) {
    res.json({ error: '"Percent Discount" must be a number between 1 and 100.'})
  } else if (fixed_discount && !valid.isInt(fixed_discount, {min: 1, max: 2300})) {
    res.json({ error: '"Fixed Discount" must be a number between 1 and 23.'})
  } else if (minimum_purchase && !valid.isInt(minimum_purchase, {min: 1})) {
    res.json({ error: '"Minimum Purchase" must be a number greater than 1.'})
  } else {
    // Run Query
    const query = `
      INSERT INTO promo_codes 
      (code, percent_discount, fixed_discount, minimum_purchase) 
      VALUES ($1, $2, $3, $4);
    `
    const values = [ 
      code, 
      +percent_discount, 
      +fixed_discount, 
      +minimum_purchase
    ]

    db.query('SELECT 1 FROM promo_codes WHERE code = $1 AND NOT deleted', [code])
      .then(check => {
        if (check.rowCount) {
          res.json({ error: 'Promo code with this name already exists.' })
        } else {
          db.query(query, values)
            .then(r => res.json({ message: 'Promo code created successfully.' }))
            .catch(e => {
              console.log(e)
              res.json({ error: 'Server error, could not create promo code.' })
            })
        }
      }).catch(e => res.json({ error: 'Server error, could not create promo code.' }))
  }
}

module.exports.delete = (req, res) => {
  db.query('UPDATE promo_codes SET deleted = true WHERE id = $1', [req.params.id])
    .then(r => res.json({ message: 'Promo code deleted successfully.' }))
    .catch(e => res.json({ error: 'Server error, could not delete promo code.' }))
}