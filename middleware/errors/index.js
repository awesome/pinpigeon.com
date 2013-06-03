
// # middleware - errors - index

module.exports = function(args) {

  var middleware = {}

  middleware['404'] = require('./404')(args)
  middleware['500'] = require('./500')(args)

  return middleware

}
