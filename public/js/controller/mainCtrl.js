chatApp.controller('mainCtrl', function ($scope, $rootScope, socket) {
	$scope.messages = [];

	$scope.submit = function () {
		var message = {
			pseudo: $rootScope.pseudo,
			text: $scope.text,
			timestamp: ''
		};

		socket.emit('sendMessageToServer', message);
		$scope.text = '';
	}

	$scope.setPseudo = function () {
		$rootScope.pseudo = $scope.pseudoToSet;
	};

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