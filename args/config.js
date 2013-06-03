
// # args - config

var path = require('path')
  , cacheAge = 24 * 60 * 60 * 1000

module.exports = {
    cookieParser: 'ADD-SOME-RANDOM-COOKIE-TOKEN-HERE'
  , sincerely: 'ADD-YOUR-SINCERELY-API-KEY-HERE'
  , staticSetup: {
      maxAge: cacheAge
    }
  , session: {
        secret: 'ADD-SOME-RANDOM-SECRET-HERE'
      , maxAge: cacheAge
      , key: 'pinpigeon'
    }
  , lessMiddleware: {
      src: path.join(__dirname, '..', 'public')
    }
}
