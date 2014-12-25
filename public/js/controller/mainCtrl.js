chatApp.controller('mainCtrl', function ($scope, socket) {
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
			timestamp: ''
		};

		socket.emit('sendMessageToServer', message);
		$scope.text = '';
	}

	socket.on('broadcastMessageToClients', function (message) {
		$scope.messages.push(message);
	});
});