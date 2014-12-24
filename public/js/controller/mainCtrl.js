chatApp.controller('mainCtrl', function ($scope) {
	$scope.messages = [
		{
			pseudo: 'Pseudo',
			text: 'Lorem.',
			timestamp: Date.now()
		},
		{
			pseudo: 'Pseudo',
			text: 'Lorem ipsum.',
			timestamp: Date.now()
		},
		{
			pseudo: 'Pseudo',
			text: 'Lorem ipsum dolor.',
			timestamp: Date.now()
		},
		{
			pseudo: 'Pseudo',
			text: 'Lorem ipsum dolor sit.',
			timestamp: Date.now()
		},
		{
			pseudo: 'Pseudo',
			text: 'Lorem ipsum dolor sit amet.',
			timestamp: Date.now()
		},
	];

	$scope.submit = function () {
		var message = {
			pseudo: 'Pseudo',
			text: $scope.text,
			timestamp: Date.now()
		};

		$scope.messages.push(message);
		$scope.text = '';
	}
});