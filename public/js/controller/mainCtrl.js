chatApp.controller('mainCtrl', function ($scope) {
	$scope.messages = [
		'Lorem ipsum dolor.',
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
		'Lorem ipsum.',
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae!',
		'Lorem ipsum dolor sit amet.',
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, veritatis!'
	];

	$scope.submit = function () {
		console.log('submit');
	}
});