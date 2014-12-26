chatApp.controller('userCtrl', function ($scope, $rootScope, socket) {
	$scope.users = []; // Liste des utilisateurs.
	$scope.bannedUsers = [];// Liste des utilisateurs bannis par l'utilisateur courrant.

	$scope.isUserBlockToDisplay = function () { // Cette fonction vérifie si on doit afficher la liste des utilisateurs = si un pseudo a été choisi.
		if ($rootScope.pseudo) {
			return true;
		}

		return false;
	};

	$scope.noOneElseConnected = function () { // Cette fonction vérifie si il n'y a qu'un seul utilisateur de connecté.
		if ($scope.users.length === 0) {
			return true;
		}

		return false;
	};

	$scope.inviteUser = function (user) { // Envoie au serveur une invitation pour une conversation privée.
		socket.emit('inviteUser', user);
	};

	socket.on('updateUsers', function (users) {	// Lorsque le serveur met à jour la liste des utilisateurs connectés.
		$scope.users = users;

		if ($rootScope.pseudo) {
			$scope.users.splice($scope.users.indexOf($rootScope.pseudo), 1); // On retire de cette liste l'utilisateur courant.
		}
	});

	// TODO Ajouter une fonction qui envoie au serveur le pseudo de la personne que l'on veut bannir et ajoute cette personne dans le scope bannedUsers.
});