var chatApp = angular.module('chatApp', ['angularMoment', 'btford.socket-io']);

chatApp.factory('socket', function (socketFactory) {
	return socketFactory(); // On crée un socket unique.
});

chatApp.run(function(amMoment) {
	amMoment.changeLocale('fr');
});