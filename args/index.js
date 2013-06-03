
// # args - index

var args       = {}
  , express    = require('express')
  , RedisStore = require('connect-redis')(express)
  , path       = require('path')
  , schemas    = require(path.join(__dirname, '..', 'schemas'))

// app
args.app = express()

// config
args.config = require('./config')

// stripe
args.config.stripe = {
    secretKey: (args.app.settings.env === 'development') ? 'YOUR-SK-TEST' : 'YOUR-SK-LIVE'
  , publishableKey: (args.app.settings.env === 'development') ? 'YOUR-PK-TEST' : 'YOUR-PK-LIVE'
}

// certs
args.certs = require('../certs/')(args.app.settings.env)

// db
args.db = require('./db')(args.app.settings.env)

// schemas
args.db.model('Postcard', schemas.postcard)

// redis
args.config.session.store = new RedisStore()

// middleware
args.middleware = require('../middleware/')(args)

module.exports = args
