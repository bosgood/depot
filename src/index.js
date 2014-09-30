var express    = require('express');
var chalk      = require('chalk');
var bodyParser = require('body-parser');
var nconf      = require('nconf');
var path       = require('path');
var authLayer  = require('./authentication');

nconf.argv().env();

const ENV = nconf.get('ENV') || 'dev';

// /depot/config/<env>.json
nconf.file(path.join('config', ENV.toLowerCase() + '.json'));

// Dynamically load store: connections/<store>-connection
var Connection = require(
  './connections/' + nconf.get('store') + '-connection'
);
connection = new Connection().connect(nconf, function(err, details) {
  if (err) {
    console.error(chalk.red('error connecting to database'));
    console.log(err);
  } else {
    console.log(
      chalk.green('successfully connected to ' + details.store + ' (' + details.connectionString + ')')
    );
  }
});

var app = express()
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(authLayer(nconf, {
    noAuthPatterns: [/^\/serve/]  // no auth required to serve apps
  }))
;

// list available apps
app.get('/apps', require('./routes/list-apps')(connection));

// app/update a version
var addUpdateRoute = require('./routes/update-version')(connection);
app.post('/apps/:appId/versions/:versionId', addUpdateRoute);
app.put('/apps/:appId/versions/:versionId', addUpdateRoute);

// list individual app version information
app.get('/apps/:appId/versions/:versionId', require('./routes/show-version')(connection));

// list available app versions
app.get('/apps/:id/versions', require('./routes/list-versions')(connection));

// get individual app information
app.get('/apps/:id', require('./routes/show-app')(connection));

// app/update an application
var addUpdateRoute = require('./routes/update-app')(connection);
app.post('/apps/:id', addUpdateRoute);
app.put('/apps/:id', addUpdateRoute);

// serve latest index.html of app listed
// use ?version=<versionId> to request a specific version
app.get('/serve/:urlSlug*', require('./routes/serve-app')(connection));

// deploy the app version by setting it as the latest version
app.post('/deploy/:appId/:versionId', require('./routes/deploy-app')(connection));

var server = app.listen(nconf.get('port'), function() {
  console.log(
    chalk.red(
      'depot',
      chalk.yellow('listening'),
      chalk.green('on'),
      chalk.blue(nconf.get('port'))
    )
  );
});
