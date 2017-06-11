
var env = 'development'//process.env.APP_ENV || 

var config = {
  development: require('./dev.env.js'),
  production: require('./prod.env.js'),
  staging: require('./test.env.js')
}

module.exports = config[env]