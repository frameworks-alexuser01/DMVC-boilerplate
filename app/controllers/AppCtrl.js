angular.module('hs.irc')
  .controller('AppCtrl', [
    '$scope', 'AppService', '$rootScope', function ($scope, AppService, $rootScope) {
    
    window.onkeyup = function (event) {
      $scope.$broadcast('scan');
    };

    $scope.mode = AppService.mode;
    $scope.state = AppService.state;
    $scope.connection = AppService.connection;
    $scope.transitionSpeed = 300;

    $scope.changeLanguage = function (event, language) {
      event.preventDefault();
      AppService.changeLanguage(language);
    };

    $scope.logout = function (event) {
      event.preventDefault();
      AppService.action('logout');
    };
			$scope.cancelRequest = function () {
				console.log('foo')
				AppService.action('cancelRequest');
			};

  }]);
