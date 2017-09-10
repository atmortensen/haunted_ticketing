const db = require('./db_connect')
const valid = require('validator')
const moment = require('moment')

module.exports = {}

module.exports.get_all = (req, res) => {
  const query = `
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
      WHERE NOT deleted;
  `

  db.query(query)
    .then(r => res.json(r.rows))
    .catch(e => console.log(e))
}

module.exports.create = (req, res) => {
  const { start_time, end_time, number_available } = req.body
  
  if (!start_time || !end_time || !number_available) {
    res.json({ error: 'Please fill all required fields.'})
  } else if (start_time >= end_time) {
    res.json({ error: '"End Time" should come after "Start Time."'})
  } else if (!moment.unix(start_time).startOf('day').isSame(moment.unix(end_time).startOf('day'))) {
    res.json({ error: 'Start and end times must be on the same day.'})
  } else if (!valid.isInt(number_available, {min: 1})) {
    res.json({ error: '"Number Available" must be a number greater than 0.'})
  } else {
    const query = `
      INSERT INTO time_slots 
      (start_time, end_time, number_available) 
      VALUES ($1, $2, $3)
    `
    const values = [ 
      +start_time,
      +end_time,
      +number_available
    ]

    db.query(query, values)
      .then(r => res.json({ message: 'Time slot created successfully.' }))
      .catch(e => res.json({ error: 'Server error, could not create time slot.' }))
  }
}

module.exports.delete = (req, res) => {
  db.query('UPDATE time_slots SET deleted = true WHERE id = $1', [req.params.id])
    .then(r => res.json({ message: 'Time slot deleted successfully.' }))
    .catch(e => res.json({ error: 'Server error, could not delete time slot.' }))
}