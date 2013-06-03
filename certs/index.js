
// # certs

var fs   = require('fs')
  , path = require('path')

function getFile(env, file) {
  return fs.readFileSync(path.join(__dirname, env, file)).toString()
}

function getCert(env) {
  var cert = {
      key: getFile(env, 'key.key')
    , cert: getFile(env, 'cert.crt').toString()
  }
  if (env === 'production')
    cert.ca = getFile(env, 'ca.crt').toString()
  return cert
}

module.exports = function(env) {
  return getCert(env)
}
