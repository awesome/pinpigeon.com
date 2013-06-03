
// # middleware - home

module.exports = function(args) {

  function middleware(req, res, next) {
    var providedURL = (req.params.pinterest_id) ? 'http://pinterest.com/pin/' + req.params.pinterest_id + '/' : ''
    res.render('index', { message: req.flash('error'), providedURL: providedURL })
  }

  return middleware

}
