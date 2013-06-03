
// # middleware - pay

var stripe = require('stripe')

module.exports = function(args) {

  var req, res, next, postcard

  var sincerely = require('sincerely')(args.config.sincerely)

  function middleware(_req, _res, _next) {

    req  = _req
    res  = _res
    next = _next

    if (!req.session.draft.preview_url)
      return res.redirect('/')

    if (!req.session.draft.sender || !req.session.draft.recipient || !req.session.draft.text_message)
      return res.redirect('/customize')

    if (typeof req.body.stripeToken !== 'string')
      return next(new Error('stripe token missing'))

    stripe(args.config.stripe.secretKey).charges.create({
        card: req.body.stripeToken
      , amount: 195
      , currency: 'usd'
      , description: req.session.draft.sender.name + ' <' + req.session.draft.sender.email + '>'
    }, processCharge)

  }

  function processCharge(err, response) {

    if (err) return next(new Error(response.error))

    console.log(response)

    // create a new postcard
    args.db.model('Postcard').create({
        name: req.session.draft.sender.name
      , email: req.session.draft.sender.email
      , pin_url: req.session.draft.pin_url
      , stripe: {
            id: response.id
          , amount: response.amount
          , fee: response.fee
        }
    }, createPostcard)

  }

  function createPostcard(err, _postcard) {

    if (err) return next(err);

    postcard = _postcard

    // finalize it with sincerely
    sincerely.create({
        message: req.session.draft.text_message
      , reference: req.session.reference
      , testMode: false
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

    console.log('finishPostcard', err, response)

    // update the postcard with sincerely info
    postcard.sincerely = {
        id: response.id
      , success: response.success
      , testMode: response.testMode
      , sent_to: response.sent_to
    }

    // save the postcard
    postcard.save(savePostcard)

  }

  function savePostcard(err) {

    if (err) return next(err);

    // clean the draft session
    delete req.session.draft
    req.session.draft = {}

    // redirect user to thank-you page
    res.redirect('/thank-you')

  }


  return middleware

}
