
// # middleware - errors - 500

module.exports = function(args) {

  function middleware(err, req, res, next) {

    if (req.xhr)
      return res.send({ status: err.status || 500, message: err.message })

    res.render('500', {
        status: err.status || 500
      , error: err
      , showStack: (args.app.settings.env === 'development') ? true : false
      , title: 'Something went wrong, oops!'
    })

  }

  return middleware

}
