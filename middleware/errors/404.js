
// # middleware - errors - 404

module.exports = function(args) {

  function middleware(req, res, next) {

    if (req.xhr)
      return res.send({ status: 404, message: 'Page not found' })

    res.render('404', {
        status: 404
      , title: 'Page not found :('
    })

  }

  return middleware

}
