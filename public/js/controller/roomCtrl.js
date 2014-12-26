chatApp.controller('roomCtrl', function ($scope, $rootScope, socket) {
	$scope.rooms = [];

	$scope.buildTitle = function (room) {
		var ret = '';

		for (var i = 0; i < room.users.length; i++) {
			if (i !== 0) {
				ret += '- ';
			}
			ret += room.users[i] + ' ';
		}

		return ret;
	}

	$scope.selectRoom = function (room) {
		$rootScope.globalConversation = false;
		$rootScope.activeRoom = room.roomId;
		$scope.room = room;
	};


	$scope.selectGlobalConversation = function () {
		$rootScope.globalConversation = true;
		$rootScope.activeRoom = false;
		$scope.room = null;
	};

	$scope.isGlobalConversationSelected = function () {
		return $rootScope.globalConversation;
	};

	$scope.isRoomSelected = function (room) {
		if ($rootScope.activeRoom && $rootScope.activeRoom === room.roomId) {
			return true;
		}

		return false;
	};

	$scope.isPrivateMessageBlockToDisplay = function () {
		if ($scope.room && $scope.room.messages.length > 0) {
			return true;
		}

		return false;
	};

	socket.on('sendRoom', function (room) {
		console.log(room);
		$scope.rooms.push(room);
		socket.emit('subscribe', room.roomId);
	});

	socket.on('privateMessage', function (message) {
		console.log(message);
		var roomId = message.roomId;

		for (var i = 0; i < $scope.rooms.length; i++) {
			if ($scope.rooms[i].roomId === roomId) {
				$scope.rooms[i].messages.push(message);
			}
		}

		var DOMId = 'room-' + message.roomId;
		var privateMessagesPanel = angular.element('#' + DOMId);
		privateMessagesPanel.animate({ scrollTop: privateMessagesPanel.prop('scrollHeight') }, 1000);
	});
});