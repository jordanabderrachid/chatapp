chatApp.controller('userCtrl', function ($scope, $rootScope, socket) {
	$scope.users = [];

	$scope.isUserBlockToDisplay = function () {
		if ($rootScope.pseudo) {
			return true;
		}

		return false;
	};

	window.addEventListener("beforeunload", function (event) {
		if ($rootScope.pseudo) {
			socket.emit('freePseudo', $rootScope.pseudo);
		}
	});

	socket.on('updateUsers', function (users) {
		$scope.users = users;
	});
});