
// # middleware - customize-postcard

module.exports = function(req, res, next) {

  if (!req.session.draft.preview_url)
    return res.redirect('/')

  res.render('customize', { message: req.flash('error') })

}
