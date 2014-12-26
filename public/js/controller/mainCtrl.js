chatApp.controller('mainCtrl', function ($scope, $rootScope, socket, webRTCService) {
	$scope.messages = [];

	$rootScope.globalConversation = true; // A la connection, le chat global est activé.
	$rootScope.activeRoom = false;	// A la connection, le chat privé n'est pas activé.

	$scope.submit = function () { // Fonction d'envoi d'un message au serveur.
		if ($scope.text.length > 0) { // Si il y a effectivement un message à envoyer (appui accidentel sur entrer).
			var message = {
				pseudo: $rootScope.pseudo,
				text: $scope.text,
				timestamp: ''
			};	// On construit le message.

			if ($rootScope.activeRoom) { // Si une conversation privée est activée.
				message.roomId = $rootScope.activeRoom; // On stocke dans le message l'id du websocket (et de la room).
			}

			socket.emit('sendMessageToServer', message);
			$scope.text = '';
		}
	}

	$scope.setPseudo = function () { // On envoie le pseudo choisi au serveur.
		// TODO gerer le cas ou le pseudo est deja pris.
		$rootScope.pseudo = $scope.pseudoToSet;
		socket.emit('claimPseudo', $rootScope.pseudo);
	};

	// Cette fonction vérifié si il y a des messages à afficher dans le chat global.
	$scope.isMessageBlockToDisplay = function () {
		if ($scope.messages.length > 0) {
			return true;
		}

		return false;
	};

	//Lors de la réception d'un message pour le chat global depuis le serveur.
	socket.on('broadcastMessageToClients', function (message) {
		$scope.messages.push(message);
		var messagesPanel = angular.element('#messages');
		messagesPanel.animate({ scrollTop: messagesPanel.prop('scrollHeight') }, 1000); // On autoscroll le panel.
	});


	// Essais webRTC. (envoi d'images)
	webRTCService.createDataChannel('id');
	console.log(webRTCService.getDataChannel('id'));

});