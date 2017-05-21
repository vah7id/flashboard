module.exports = function(app) {
  var User = app.loopback.getModel('User');
  User.settings.acls = [
		{
		"accessType": "EXECUTE",
		"principalType": "ROLE",
		"principalId": "$owner",
		"permission": "ALLOW",
		"property": "__get__orders"
		}];
};