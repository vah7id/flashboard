
var env = process.env.APP_ENV || 'development'

var config = {
  development: require('./dev.env.js'),
  production: require('./prod.env.js'),
  staging: require('./test.env.js')
}

module.exports = config[env]