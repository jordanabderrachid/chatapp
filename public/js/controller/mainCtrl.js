chatApp.controller('mainCtrl', function ($scope, socket) {
	$scope.messages = [];

	$scope.submit = function () {
		var message = {
			pseudo: 'Pseudo',
			text: $scope.text,
			timestamp: ''
		};

		socket.emit('sendMessageToServer', message);
		$scope.text = '';
	}

	$scope.isMessageBlockToDisplay = function () {
		if ($scope.messages.length > 0) {
			return true;
		}

		return false;
	};
	socket.on('broadcastMessageToClients', function (message) {
		$scope.messages.push(message);
	});
});