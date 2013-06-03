
// # middleware - h5bp

var mime = require('mime')

module.exports = function(req, res, next) {

  var ua   = req.headers['user-agent']
    , type = mime.lookup(req.url)

  if (type === 'application/octet-stream' && req.url === '/')
    type = 'text/html'

  if (ua && ua.indexOf('MSIE') && 'text/html' === type)
    res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');

  next()

}
