chatApp.controller('mainCtrl', function ($scope, $rootScope, socket, webRTCService) {
	$scope.messages = [];

	$rootScope.globalConversation = true;
	$rootScope.activeRoom = false;

	$scope.submit = function () {
		if ($scope.text.length > 0) {
			var message = {
				pseudo: $rootScope.pseudo,
				text: $scope.text,
				timestamp: ''
			};

			if ($rootScope.activeRoom) {
				message.roomId = $rootScope.activeRoom;
			}

			socket.emit('sendMessageToServer', message);
			$scope.text = '';
		}
	}

	$scope.setPseudo = function () {
		$rootScope.pseudo = $scope.pseudoToSet;
		socket.emit('claimPseudo', $rootScope.pseudo);
	};

	$scope.isMessageBlockToDisplay = function () {
		if ($scope.messages.length > 0) {
			return true;
		}

		return false;
	};

	socket.on('broadcastMessageToClients', function (message) {
		$scope.messages.push(message);
		var messagesPanel = angular.element('#messages');
		messagesPanel.animate({ scrollTop: messagesPanel.prop('scrollHeight') }, 1000);
	});

	webRTCService.createDataChannel('id');
	console.log(webRTCService.getDataChannel('id'));
	
});