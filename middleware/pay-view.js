
// # middleware - pay-view

module.exports = function(req, res, next) {

  if (!req.session.draft.preview_back_url)
    return res.redirect('/customize')

  res.render('pay')

}
