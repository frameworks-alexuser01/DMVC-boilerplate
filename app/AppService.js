angular.module('hs.irc')
  .factory('AppService', ['$http', '$state', '$translate', 'WebsocketService', '$rootScope', function ($http, $state, $translate, WebsocketService, $rootScope) {

    var connectionOptions = window.connectionOptions;
    delete window.connectionOptions;

    var service = {};

    // allowAction is used to lock buttons etc.
    // while an action is passed to the server
    $rootScope.allowAction = true;

    var connectToWebsocket = function () {

      // Reset any previous listeners
      WebsocketService.removeAllListeners();

      // Delay update of UI by 100 ms due to strange bug
      WebsocketService.on('connecting', function () {
        setTimeout(function () {
          $rootScope.$apply();
        }, 100);
      });

      // Delay update of UI by 100 ms due to strange bug
      WebsocketService.on('connected', function () {
        setTimeout(function () {
          $rootScope.$apply();
        }, 100);
      });

      WebsocketService.on('update', function (state) {

        // Keep existing state object, just remove the
        // props
        Object.keys(service.state).forEach(function (key) {
          delete service.state[key];
        });

        // Insert new state
        angular.extend(service.state, state);
        console.log('state', state);

        // Allow actions and trigger transition
        $rootScope.allowAction = true;
        $rootScope.$broadcast('transition', state.uiState);

      });

      // Delay update of UI by 100 ms due to strange bug
      WebsocketService.on('error', function () {
        setTimeout(function () {
          $rootScope.$apply();
        }, 100);
      });

      // Delay update of UI by 100 ms due to strange bug and
      // set application in connecting state
      // Try to reconnect after 2 seconds
      WebsocketService.on('disconnected', function () {
        setTimeout(function () {
          $rootScope.$apply();
          $rootScope.$broadcast('transition', 'app.connecting');
        }, 100);
        setTimeout(function () {
          WebsocketService.connect(connectionOptions);
        }, 100);
      });

      // Do the initial connect
      WebsocketService.connect(connectionOptions);

    };

    // Set service connection state and UI state
    service.connection = WebsocketService.state;
    service.state = {
      uiState: 'app.connecting'
    };

    service.changeLanguage = function (language) {
      $translate.use(language);
    };

    service.action = function (name, data) {
      if ($rootScope.allowAction) {
        $rootScope.allowAction = false;
        WebsocketService.send(name, data);
      }
    };

    // attach the service state to the $rootScope,
    // making it available to all controllers and
    // templates
    $rootScope.state = service.state;

    connectToWebsocket();

    return service;

  }]);
