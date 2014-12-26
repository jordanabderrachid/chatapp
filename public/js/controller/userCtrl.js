chatApp.controller('userCtrl', function ($scope, $rootScope, socket) {
	$scope.users = [];

	$scope.isUserBlockToDisplay = function () {
		if ($rootScope.pseudo) {
			return true;
		}

		return false;
	};

	$scope.noOneElseConnected = function () {
		if ($scope.users.length === 0) {
			return true;
		}

		return false;
	};

	$scope.inviteUser = function (user) {
		socket.emit('inviteUser', user);
	};

	socket.on('updateUsers', function (users) {
		$scope.users = users;

		if ($rootScope.pseudo) {
			$scope.users.splice($scope.users.indexOf($rootScope.pseudo), 1);
		}
	});
});