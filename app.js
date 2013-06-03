
// # app

var express = require('express')
  , http    = require('http')
  , https   = require('https')
  , path    = require('path')
  , flash   = require('connect-flash')
  , args    = require('./args')

var app = args.app

// set port
app.set('port', 443)

// make jade the default view engine
app.set('view engine', 'jade')

app.set('views', path.join(__dirname, 'views'))

// ignore GET /favicon.ico
app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')))

// logging
app.use(express.logger('dev'))

// parse request bodies (req.body)
app.use(express.bodyParser())

// support _method (PUT in forms etc)
app.use(express.methodOverride())

// pass a secret to cookieParser() for signed cookies
app.use(express.cookieParser(args.config.cookieParser))

// add req.session cookie support
app.use(express.session(args.config.session))

// enable flash messages
app.use(flash())

// use h5bp app helpers
app.use(args.middleware.h5bp)

// disable x-powered-by
app.disable('x-powered-by')

// less middleware
app.use(require('less-middleware')(args.config.lessMiddleware))

app.use(express.static(path.join(__dirname, 'public'), args.config.staticSetup))

// development config
app.configure('development', function() {
  app.use(express.errorHandler({
      dumpExceptions: true
    , showStack: true
  }));
})

// production config
app.configure('production', function() {
  app.enable('view cache')
  app.use(express.compress())
})

// app local variables
app.locals.title = 'PinPigeon'
app.locals.tagline = 'Send pins as printed & shipped postcards for only 1.95'
app.locals.stripe = args.config.stripe


// ## www redirect
app.use(wwwRedirect)
function wwwRedirect(req, res, next) {
  if (/^www\./.test(req.host)) {
    res.statusCode = 301
    var location = [ '//', req.host.replace(/^www\./, ''), req.url ]
    res.setHeader('Location', location.join(''))
    return res.end()
  }
  next()
}

// add csrf token support
app.use(express.csrf())
app.use(args.middleware.csrf)

// routes

app.use(args.middleware.draft)

app.get('/', args.middleware.home)
app.get('/pin/:pinterest_id', args.middleware.home)

app.post('/preview', args.middleware.preview, args.middleware.draft, args.middleware.preview_url)
app.get('/preview', args.middleware.preview_url)

app.post('/customize', args.middleware.customize, args.middleware.pay_redirect)
app.get('/customize', args.middleware.customize_postcard)

app.get('/checkout', args.middleware.pay_view)
app.post('/checkout', args.middleware.pay)

app.get('/thank-you', args.middleware.thank_you)

app.get('/terms', args.middleware.terms)
app.get('/privacy', args.middleware.privacy_policy)

app.use(app.router)

app.use(args.middleware.errors['500'])
app.get('/404', args.middleware.errors['404'])


https.createServer(args.certs, app).listen(443)

function getAll(req, res) {
  var url = 'https://' + req.headers.host.replace(/^www\./, '') + req.url
  res.writeHead(301, {
    Location: url
  })
  res.end()
}
http.createServer(getAll).listen(80, log)

function log() {
  console.log('express listening on port', app.get('port'))
}
