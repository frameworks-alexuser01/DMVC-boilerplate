var index = require('./index.js');
var cookie = require('cookie');

var sessions = {};

/*
 * Changing default state restarts server and updates
 * client app automatically
 */
var defaultState = {
  uiState: 'app.welcome'
};

/*
 * Sends updates to all listening clients
 */
var sendUpdate = function (session) {
  session.sockets.forEach(function (socket) {
    socket.send(JSON.stringify({
      type: 'update',
      state: session.state,
      userType: session.userType
    }));
  });
};

/*
 * Create any default state for the application to
 * handle
 */
var createInitialState = function (data) {
  return defaultState;
};

module.exports = {

  // Adds a new websocket session
  addSession: function (socket) {

    var headerCookie = socket.upgradeReq.headers.cookie;
    var cookies = cookie.parse(headerCookie);
    var uuid = cookies.uuid_irc;
    var session = sessions[uuid];

    /* Register message listener in case you want to
     * react to a specific action triggered and
     * transition the UI
     */
    socket.on('message', function (data) {
      data = JSON.parse(data);
      switch (data.action) {
        case 'someAction':
          session.state.uiState = 'app.orders.approvedWeight';
          session.state.foo = 'bar';
          sendUpdate(session);
          break;
      }
    });

    /* Clean up sessions as they close */
    socket.on('close', function () {
      session.sockets.splice(session.sockets.indexOf(socket), 1);
    });

    /* If session already exists, send the current data
     * or create a new session object based on the cookie set
     * by the client
     */
    if (session) {
      session.sockets.push(socket);
      sendUpdate(session);
    } else {
      var session = sessions[uuid] = {
        sockets: [socket],
        state: createInitialState()
      };
      sendUpdate(session);
    }
  }
};
