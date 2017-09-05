const jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs')

module.exports = {}

// LOGIN
module.exports.login = (req, res) => {
  if (bcrypt.compareSync(req.body.password, process.env.HASHED_PASSWORD)) {
    res.send(jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.JWT_SECRET))
  } else {
    res.json({ error: 'Incorrect password!' })
  }
}

module.exports.hash = (req, res) => {
  bcrypt.hash(req.params.password, 10, (err, hashed) => {
    if (err) {
      res.send(err)
    } else {
      res.send(hashed)
    }
  })
}

// ADMIN AUTH MIDDLEWARE
module.exports.admin_route = (req, res, next) => {
  jwt.verify(req.header('Authorization'), process.env.JWT_SECRET, err => {
    if (err) {
      res.json({ 
        error: 'Invalid login!',
        invalidLogin: true
      })
    } else {
      next()
    }
  })
}