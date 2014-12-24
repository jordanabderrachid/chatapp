var chatApp = angular.module('chatApp', ['angularMoment']);

chatApp.run(function(amMoment) {
	amMoment.changeLocale('fr');
});