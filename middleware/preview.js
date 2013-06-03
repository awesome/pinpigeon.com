
// # middleware - preview

var request = require('request')
  , path    = require('path')
  , fs      = require('fs')
  , cheerio = require('cheerio')

module.exports = function(args) {

  var req, res, next

  var sincerely = require('sincerely')(args.config.sincerely)

  function middleware(_req, _res, _next) {

    req = _req
    res = _res
    next = _next

    // ensure we have a proper body and response
    if (!req.body || !req.body.url || typeof req.body.url !== 'string') {
      req.flash('error', 'Invalid request, please try again later or contact <a href="mailto:support@pinpigeon.com">support@pinpigeon.com</a>.')
      res.redirect('back')
      return
    }

    // validate url contains "http://pinterest.com/..."
    if (!req.body.url.match(/^http:\/\/pinterest\.com\/pin\/[\^\d*$]/)) {
      req.flash('error', "Please enter the link to a pin's page on Pinterest (not of the pin's image).")
      res.redirect('back')
      return
    }

    request.get(req.body.url, parsePage)
  }

  function parsePage(err, response, body) {
    if (err) return next(err)

    // Hand the HTML response off to Cheerio and assign that to
    //  a local $ variable to provide familiar jQuery syntax
    var $    = cheerio.load(body)
      , src  = $('#pinCloseupImage').attr('src')
      , desc = $('.description').text() || ''

    var text_url = req.body.url

    var len = text_url.length

    // strip trailing slash from url
    if (text_url.charAt(len - 1) === '/')
      text_url = text_url.substring(0, len - 1)

    // remove http:// from the url
    text_url = text_url.replace('http://', '')

    if (!req.session.draft)
      req.session.draft = {}

    if (desc.length - text_url.length + 5 > 300)
      req.session.draft.text_message = desc.substr(0, 299 - text_url.length - 5) + '\n—\n' + text_url
    else
      req.session.draft.text_message = desc + '\n—\n' + text_url

    request.get({ url: src, encoding: 'binary' }, getSrc)

  }

  function getSrc(err, response, body) {
    if (err) return next(err)
    if (response.statusCode !== 200) return next(new Error('pin does not exist'))
    sincerely.upload({
      photo: new Buffer(body.toString(), 'binary').toString('base64')
    }, uploadPhoto)
  }

  function uploadPhoto(err, response) {
    if (err) return next(err)
    req.session.draft.pin_url = req.body.url
    req.session.draft.front_photo_id = response.id
    sincerely.create({
        testMode: true
      , frontPhotoId: response.id
      , recipients: [
          {
              name: 'PinPigeon'
            , email: 'support@pinpigeon.com'
            , street_1: 'PO Box 835'
            , city: 'Greensburg'
            , state: 'PA'
            , postalcode: '15601'
          }
        ]
      , sender: {
          email: 'support@pinpigeon.com'
        }
    }, previewFront)
  }

  function previewFront(err, response) {
    if (err) return next(err)
    req.session.draft.preview_url = response.sent_to[0].previewUrl
    next()
  }

  return middleware

}
