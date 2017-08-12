'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  
  router.post('/googleAnalytics', function(req, res) {
	  res.send('Hello Seattle\n');
  });
  
  server.use(router);
};
