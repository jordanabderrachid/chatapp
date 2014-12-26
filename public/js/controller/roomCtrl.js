chatApp.controller('roomCtrl', function ($scope, $rootScope, socket) {
	$scope.rooms = [];

	$scope.buildTitle = function (room) { // Cette fonction construit le titre d'une conversation privée à partir des pseudos des utilisateurs de la conversation.
		var ret = '';

		for (var i = 0; i < room.users.length; i++) {
			if (i !== 0) {
				ret += '- ';
			}
			ret += room.users[i] + ' ';
		}

		return ret;
	}

	$scope.selectRoom = function (room) { // On choisi d'afficher une conversation privée.
		$rootScope.globalConversation = false;
		$rootScope.activeRoom = room.roomId;
		$scope.room = room;
	};


	$scope.selectGlobalConversation = function () { // On choisi d'afficher la conversation globale.
		$rootScope.globalConversation = true;
		$rootScope.activeRoom = false;
		$scope.room = null;
	};

	$scope.isGlobalConversationSelected = function () {	// Si la conversation globale est sélectionnée.
		return $rootScope.globalConversation;
	};

	$scope.isRoomSelected = function (room) { // Vérifie si la conversation privée passée en parametre est sélectionnée.
		if ($rootScope.activeRoom && $rootScope.activeRoom === room.roomId) {
			return true;
		}

		return false;
	};

	$scope.isPrivateMessageBlockToDisplay = function () { // Vérifie si le panel de messages privés doit être affiché. 
		if ($scope.room && $scope.room.messages.length > 0) {
			return true;
		}

		return false;
	};

	socket.on('sendRoom', function (room) { // Lors de la réception d'une conversation privée du serveur.
		console.log(room);
		$scope.rooms.push(room);
		socket.emit('subscribe', room.roomId);
	});

	socket.on('privateMessage', function (message) { // Lors de la réception d'un message privé du serveur.
		console.log(message);
		var roomId = message.roomId;

		for (var i = 0; i < $scope.rooms.length; i++) { // On ajoute le message à la bonne conversation en fonction de son id.
			if ($scope.rooms[i].roomId === roomId) {
				$scope.rooms[i].messages.push(message);
			}
		}

		var DOMId = 'room-' + message.roomId;
		var privateMessagesPanel = angular.element('#' + DOMId);
		privateMessagesPanel.animate({ scrollTop: privateMessagesPanel.prop('scrollHeight') }, 1000); // On autoscroll la panel de message privé concerné en fonction de son id.
	});
});