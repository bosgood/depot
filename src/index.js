var express = require('express');
var chalk = require('chalk');
var app = express();

const PORT = 3000;

var Connection = require('./connections/redis-connection');
connection = new Connection().connect();

// list all available apps
app.get('/', require('./routes/list-apps')(connection));
// serve index.html of app listed
app.get('/app', require('./routes/serve-app')(connection));

var server = app.listen(PORT, function() {
  console.log(
    chalk.red(
      'depot',
      chalk.yellow('listening'),
      chalk.green('on'),
      chalk.blue(PORT)
    )
  );
});