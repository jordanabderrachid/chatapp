chatApp.controller('userCtrl', function ($scope, $rootScope, socket) {
	$scope.users = [];

	$scope.isUserBlockToDisplay = function () {
		if ($rootScope.pseudo) {
			return true;
		}

		return false;
	};

	socket.on('updateUsers', function (users) {
		$scope.users = users;
	});
});