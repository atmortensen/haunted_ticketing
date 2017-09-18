const qr = require('qr-image')
module.exports = {}

module.exports.get = (req, res) => {
	const image = qr.image(req.params.data)
	res.setHeader('Content-Type', 'image/png')
	image.pipe(res)
}
