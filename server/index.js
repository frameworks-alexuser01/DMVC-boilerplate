var fs = require('fs');
var config = require('./../config.json');
config = global.doProxy ? config.proxy : config.dev;

/* INDEX template related variables */
var livereloadScript = '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>';
var tagMatch = /\{\{.*?\}\}/g;
var bracketMatch = /\{|\}/g;

/* Connection options passed to template */
var connectionOptions = {
  baseUrl: config.HOST,
  port: config.PORT,
  wsPort: config.WS_PORT
};

module.exports = function (params) {

  /*
   * Load up latest version of index file
   */
  var indexHtml = fs.readFileSync(__dirname + '/../index.html').toString();
  params.livereload = livereloadScript;
  params.connectionOptions = connectionOptions;
  params.mode = global.doProxy ? 'DEV - proxying' : 'DEV';

  /*
   * Replaces brackets with properties from params. Or removes
   * them if no param. Pushes state directly into template
   */
  var tags = indexHtml.match(tagMatch);
  tags.forEach(function (tag) {
    var key = tag.replace(bracketMatch, '');
    indexHtml = indexHtml.replace(tag, key === 'livereload' ? params[key] : JSON.stringify(params[key]));
  });

  return indexHtml;

};
