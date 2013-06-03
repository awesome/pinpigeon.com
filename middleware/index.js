
// # middleware - index

module.exports = function(args) {

  var middleware = {}

  middleware.h5bp = require('./h5bp')
  middleware.csrf = require('./csrf')
  middleware.errors = require('./errors/')(args)
  middleware.draft = require('./draft')

  middleware.home = require('./home')(args)

  middleware.preview = require('./preview')(args)
  middleware.preview_url = require('./preview-url')

  middleware.customize = require('./customize')(args)
  middleware.customize_postcard = require('./customize-postcard')

  middleware.pay = require('./pay')(args)
  middleware.pay_view = require('./pay-view')
  middleware.pay_redirect = require('./pay-redirect')

  middleware.thank_you = require('./thank-you')

  middleware.terms = require('./terms')
  middleware.privacy_policy = require('./privacy-policy')

  return middleware

}
