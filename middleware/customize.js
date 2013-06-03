
// # middleware - customize

var emailRegexp = /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/
  , emptyString = /^[\s\t\r\n]*$/

module.exports = function(args) {

  var req, res, next

  var sincerely = require('sincerely')(args.config.sincerely)

  function middleware(_req, _res, _next) {

    req  = _req
    res  = _res
    next = _next

    if (!req.session.draft.preview_url)
      return res.redirect('/')

    if (
         !req.body.sender_name     || typeof req.body.sender_name !== 'string'     || req.body.sender_name.length === 0 || req.body.sender_name.match(emptyString)
      || !req.body.sender_email    || typeof req.body.sender_email !== 'string'    || !req.body.sender_email.match(emailRegexp)
      || !req.body.sender_street_1 || typeof req.body.sender_street_1 !== 'string' || req.body.sender_street_1 === 0 || req.body.sender_street_1.match(emptyString)
      || typeof req.body.sender_street_2 !== 'string'
      || !req.body.sender_city     || typeof req.body.sender_city !== 'string'     || req.body.sender_city.length === 0 || req.body.sender_city.match(emptyString)
      || !req.body.sender_state    || typeof req.body.sender_state !== 'string'    || req.body.sender_state.length < 2 || req.body.sender_state.match(emptyString)
      || !req.body.sender_zip      || typeof req.body.sender_zip !== 'string'      || req.body.sender_zip.length < 5 || req.body.sender_zip.match(emptyString)
    ) {
      req.flash('error', 'Return address fields were missing or invalid.')
      res.redirect('back')
      return
    }

    if (
         typeof req.body.recipient_name !== 'string'
      || typeof req.body.recipient_email !== 'string'
      || typeof req.body.recipient_street_1 !== 'string'
      || typeof req.body.recipient_street_2 !== 'string'
      || typeof req.body.recipient_city !== 'string'
      || typeof req.body.recipient_state !== 'string'
      || typeof req.body.recipient_zip !== 'string'
    ) {
      req.flash('error', 'Recipient address fields were missing or invalid.')
      res.redirect('back')
      return
    }

    if (!req.body.recipient_email.match(emptyString) && !req.body.recipient_email.match(emailRegexp)) {
      req.flash('error', "Recipient's email address is invalid.")
      res.redirect('back')
      return
    }

    if (req.body.recipient_email === '' &&
        (req.body.recipient_street_1.match(emptyString) || req.body.recipient_city.match(emptyString) || req.body.recipient_state.match(emptyString) || req.body.recipient_zip.match(emptyString))
       ) {
      req.flash('error', "Recipient's address was not provided (or) their email to request it from was missing.")
      res.redirect('back')
      return
    }

    if (typeof req.body.text_message !== 'string') {
      req.flash('error', 'Invalid custom message.')
      res.redirect('back')
      return
    }

    req.session.draft.sender = {
        name: req.body.sender_name
      , email: req.body.sender_email
      , street_1: req.body.sender_street_1
      , street_2: req.body.sender_street_2
      , city: req.body.sender_city
      , state: req.body.sender_state
      , zip: req.body.sender_zip
    }

    req.session.draft.recipient = {
        name: req.body.recipient_name
      , email: req.body.recipient_email
      , street_1: req.body.recipient_street_1
      , street_2: req.body.recipient_street_2
      , city: req.body.recipient_city
      , state: req.body.recipient_state
      , zip: req.body.recipient_zip
    }

    req.session.draft.text_message = req.body.text_message

    req.session.reference = new Date().getTime().toString()

    sincerely.create({
        message: req.session.draft.text_message
      , reference: req.session.reference
      , testMode: true
      , frontPhotoId: req.session.draft.front_photo_id
      //, profilePhotoId: response.id
      , recipients: [
          {
              name: req.session.draft.recipient.name
            , email: req.session.draft.recipient.email
            , street1: req.session.draft.recipient.street_1
            , street2: req.session.draft.recipient.street_2
            , city: req.session.draft.recipient.city
            , state: req.session.draft.recipient.state
            , postalcode: req.session.draft.recipient.zip
            , country: 'United States'
          }
        ]
      , sender: {
            name: req.session.draft.sender.name
          , email: req.session.draft.sender.email
          , street1: req.session.draft.sender.street_1
          , street2: req.session.draft.sender.street_2
          , city: req.session.draft.sender.city
          , state: req.session.draft.sender.state
          , postalcode: req.session.draft.sender.zip
          , country: 'United States'
        }
    }, finishPostcard)

  }

  function finishPostcard(err, response) {
    if (err) return next(err)
    req.session.draft.preview_back_url = response.sent_to[0].previewBackUrl
    next()
  }

  return middleware

}
