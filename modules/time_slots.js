const db = require('./db_connect')

module.exports = {}

module.exports.get_all = (req, res) => {
  db.query('SELECT * FROM time_slots WHERE NOT deleted')
    .then(r => res.json(r.rows))
    .catch(e => res.json({ error: 'Server error, could not load time slots.' }))
}

module.exports.create = (req, res) => {
  const query = `
    INSERT INTO time_slots 
    (start_time, end_time, number_available) 
    VALUES ($1, $2, $3)
  `
  const values = [ 
    req.body.start_time,
    req.body.end_time,
    req.body.number_available
  ]

  db.query(query, values)
    .then(r => res.json({ message: 'Time slot created successfully.' }))
    .catch(e => res.json({ error: 'Server error, could not create time slot.' }))
}

module.exports.delete = (req, res) => {
  db.query('UPDATE time_slots SET deleted = true WHERE id = $1', [req.params.id])
    .then(r => res.json({ message: 'Time slot deleted successfully.' }))
    .catch(e => res.json({ error: 'Server error, could not delete time slot.' }))
}