
// # middleware - preview-url

module.exports = function(req, res, next) {

  if (!req.session.draft.preview_url)
    return res.redirect('/')

  res.render('preview')

}
