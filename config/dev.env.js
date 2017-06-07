var merge = require('webpack-merge')
var prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_BASE_URL: 'http://127.0.0.1',
  API_PORT: 3000,
  THEME: 'teal'
})
