angular.module('hs.irc', [
    'ui.router',
    'templates',
    'hs.irc.translate',
    'hs.dropdown',
    'ui.bootstrap.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
  ])

  /*
   * User agent to identify touch-able devices
   */
  .constant('CONFIG', {
    phone: navigator.userAgent.match(/iPad|iPhone|Mobile/i) != null || navigator.userAgent.match(/NT/) != null || navigator.standalone
  })
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      // Prevent scrolling of body
      document.addEventListener('touchmove', function (event) {
        event.preventDefault();
      });

      /*
       * Use deeper abstracts to separate logic. E.g. abstract
       * "app.admin" with AdminCtrl and then specific "app.admin.users" and
       * "app.admin.products" that share the controller
       */
      $urlRouterProvider.otherwise('/connecting');
      $stateProvider
        .state('app', {
          url: '',
          templateUrl: 'templates/app.html',
          controller: 'AppCtrl',
          abstract: true
        })
        .state('app.connecting', {
          url: '/connecting',
          templateUrl: 'templates/connecting.html'
        })
        .state('app.welcome', {
          url: '/welcome',
          templateUrl: 'templates/welcome.html'
        })

    }
  ])
  .run(['AppService', '$state', '$rootScope', '$modal', '$http', 'CONFIG', '$templateCache', function (AppService, $state, $rootScope, $modal, $http, CONFIG, $templateCache) {

    // Add phone class to body for specific phone CSS
    if (CONFIG.phone) {
      document.body.className = "phone";
    }

    /* Transition nicely when new uiStates arrive */
    $rootScope.$on('transition', function (event, uiState) {

      // do not transition if it is the same state
      if ($state.is(uiState)) {
        $rootScope.$apply(); // Updates the state change
        return;
      }

      // Close modal if transitioing to a new page
      if ($modal.modalInstance) {
        $modal.modalInstance.close();
        delete $modal.modalInstance;
      }

      // Do a nice transition
      document.querySelector('.app-page-container').style.opacity = '0';
      setTimeout(function () {
        $state.go(uiState);
        $rootScope.$apply(); // Updates the state change
        setTimeout(function () {
          document.querySelector('.app-page-container').style.opacity = '1';
        }, 200);
      }, 200);

    });

    // Go to initial uiState
    $state.go(AppService.state.uiState);

  }]);
