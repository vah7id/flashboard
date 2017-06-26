var merge = require('webpack-merge')
var prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
  //Application Configs Json
  NODE_ENV: '"development"',
  API_BASE_URL: 'http://127.0.0.1',
  API_PORT: 3000,
  THEME: 'carbon',
  LOGO: 'src/assets/logo.png',
  BRAND: 'FLASHBOARD',
  forbidden_download: false,
  disable_admin:false
})
