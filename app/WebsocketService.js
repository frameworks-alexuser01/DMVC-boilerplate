angular.module('hs.irc')
  .factory('WebsocketService', ['$state', function ($state) {

    var socket = null;
    var service = new EventEmitter2();
    var cookieKey = 'uuid_irc';

    /*
     * Manually set cookie in client if it does not exist
     */
    var setCookie = function () {
      
      var cookieKeys = document.cookie.split(';').map(function (cookie) {
        return cookie.trim().split('=')[0];
      });

      if (cookieKeys.indexOf('uuid_irc') === -1) {
        var randomId = Date.now() + parseInt(Math.random() * 100);
        document.cookie = cookieKey + '=' + randomId + '; expires=Fri, 3 Aug 2500 20:47:11 UTC; path=/';
      }

    };

    // Set state when connection is open
    var onopen = function () {
      service.state.isConnecting = false;
      service.state.isConnected = true;
      setStateText();
    };

    // Emit an update based on the message received
    var onmessage = function (event) {
      var message = JSON.parse(event.data);
      switch (message.type) {
        case 'noSession':
          socket.close();
          break;
        case 'update':
          service.emit('update', message.state, message.userType);
          break;
      }
    };

    // Change connection state on error
    var onerror = function (e) {
      console.log('got error', e);
      service.state.isConnecting = false;
      service.state.isConnected = false;
      setStateText();
      service.emit('error');
    };

    // Change connection state when socket is closed
    var onclose = function () {
      console.log('socket closed');
      service.state.isConnecting = false;
      service.state.isConnected = false;
      setStateText();
      service.emit('disconnected');
    };

    // Set correct connection text
    var setStateText = function () {
      service.state.text = service.state.isConnected ? 'Online' : service.state.isConnecting ? 'Connecting' : 'Offline';
    };

    // Set initial connection state
    service.state = {
      isConnecting: false,
      isConnected: false,
      text: 'Offline'
    };

    service.connect = function (connectionOptions) {
      setCookie();
      socket = new WebSocket('ws://' + location.hostname + ':23112/ws');
      socket.onopen = onopen;
      socket.onmessage = onmessage;
      socket.onerror = onerror;
      socket.onclose = onclose;
      service.state.isConnecting = true;
      setStateText();

      // Async
      setTimeout(function () {
        service.emit('connecting');
      }, 0);

    };

    /*
     * Send data by websocket using the signature
     * action (string) and data (object)
     */
    service.send = function (action, data) {

      socket.send(JSON.stringify({
        action: action,
        uiState: $state.current.name,
        data: data
      }));

    };

    return service;

  }]);
