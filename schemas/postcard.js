
// # postcard

var mongoose = require('mongoose')
  , Schema   = mongoose.Schema

var SentTo = new Schema({
    id: Number
  , printId: String
  , previewUrl: String
  , previewBackUrl: String
})

var Postcard = new Schema({
    name: String
  , email: {
        type: String
      , lowercase: true
      , trim: true
      , match: /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/
    }
  , pin_url: String
  , sincerely: {
        id: Number
      , success: Boolean
      , testMode: Boolean
      , sent_to: [SentTo]
    }
  , stripe: {
        id: String
      , amount: Number
      , fee: Number
    }
})

module.exports = Postcard
