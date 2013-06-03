
// # middleware - draft

module.exports = function(req, res, next) {
  res.locals.draft = req.session.draft || {}
  next()
}
