
// # middleware - pay-redirect

module.exports = function(req, res, next) {

  if (!req.session.draft.preview_url)
    return res.redirect('/')

  if (!req.session.draft.sender || !req.session.draft.recipient || !req.session.draft.text_message)
    return res.redirect('/customize')

  res.redirect('/checkout')

}
