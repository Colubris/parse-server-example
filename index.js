// Colubris express application adding the parse-server module to expose Parse
// compatible API routes and services.

var SimpleMailgunAdapter = require('parse-server-simple-mailgun-adapter')

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

// avoid error code 141 (XMLHttpRequest - Unable to connect to the Parse API)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Enable parse-server logs
process.env.VERBOSE=true;
process.env.VERBOSE_PARSE_SERVER=true;
process.env.VERBOSE_PARSE_SERVER_PUSH_ADAPTER=true;

// JSON configuration.
var config = require('./parse-clients-config.json');
var clients = config.apps;

var i = process.argv.slice(2);

var client = clients[i];
var port = client.port;
var name = client.appName;
var serverURL = client.serverURL;
var api = new ParseServer(client);
var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var chunks = serverURL.split('/')
var mountPath = '/' + chunks[chunks.length - 2];
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I\'m a monster!');
});

var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {});
console.log(name + ' running on port ' + port + '.');

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);