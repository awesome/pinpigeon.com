
// # args - db

var mongoose = require('mongoose')

var db = {
    development: {
        host: 'localhost'
      , database: 'pinpigeon'
      , port: '27017'
    }
  , production: {
        host: 'user:password@some-host-like-mongohq.com'
      , database: 'pinpigeon'
      , port: '10032'
    }
}

module.exports = function(env) {
  return mongoose.connect(db[env].host, db[env].database, db[env].port)
}
