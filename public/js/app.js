var chatApp = angular.module('chatApp', ['angularMoment', 'btford.socket-io']);

chatApp.factory('socket', function (socketFactory) {
	return socketFactory();
});

chatApp.run(function(amMoment) {
	amMoment.changeLocale('fr');
});