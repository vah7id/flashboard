'use strict';

var google = require('googleapis');
var key = require('google.json');

var env = require("../../../config/configs.js");

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  
  router.get('/googleAnalytics', function(req, res) {

    const VIEW_ID = 'ga:'+env.GOOGLE_VIEWID;

    let jwtClient = new google.auth.JWT(
	  key.client_email, null, key.private_key,
	  ['https://www.googleapis.com/auth/analytics.readonly'], null);
		
    jwtClient.authorize(function (err, tokens) {
	  
	  if (err) {
	    console.log(err);
	    return;
	  }

	  let analytics = google.analytics('v3');
	  
	  analytics.data.ga.get({
	    'auth': jwtClient,
	    'ids': VIEW_ID,
	    'metrics': 'ga:users,ga:pageviews',
	    'dimensions': 'ga:date',
	    'start-date': '30daysAgo',
	    'end-date': 'today',
	    'max-results': 31
	  }, function (err, response) {
	    if (err) {
	      console.log(err);
	      return;
	    }
	    res.status(200).json(response);
	  });  

	});

  });
  
  server.use(router);
};
