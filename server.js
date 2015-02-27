require('es6-promise').polyfill();

/* GLOBAL CONFIG */
global.doProxy = process.argv[2] === 'proxy';

/* DEPENDENCIES */
var httpProxy = require('http-proxy');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var controller = require('./server/controller.js');

/* CONFIG */
var config = require('./config.json');
config = global.doProxy ? config.proxy : config.dev;

/* INITIALIZE SERVER */
var app = express();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  port: 23112
});
var restProxy = httpProxy.createProxyServer({
  target: {
    host: config.PROXY_HOST,
    port: config.PROXY_PORT
  }
});

/* PREVENT CACHING */
app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  return next();
});

/* ASSETS */
app.use(express.static('./build'));
app.use('/fonts', express.static('./build/fonts'));

/* COOKIE and BODY parsers
 * BODY parser only needed to parse websocket messages
 * in DEV mode
 */
app.use(cookieParser());
if (!global.doProxy) {
  app.use(bodyParser.json());
}

/* START SERVER */
if (global.doProxy) {

  var server = require('http').createServer(app);

  server.on('upgrade', function (req, socket, head) {
    restProxy.ws(req, socket, head);
  });

  restProxy.on('error', function (e) {
    console.log(e);
  });

  server.listen(config.PORT, function () {
    console.log('Server listening in DEV PROXY mode on port ', config.PORT);
  });

} else {

  app.listen(config.PORT, function () {
    console.log('Server listening in DEV mode on port ', config.PORT);
  });

  wss.on('connection', controller.addSession);

}
