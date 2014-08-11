var express = require('express');
var chalk = require('chalk');
var app = express();

const PORT = 3000;

app.get('/', function() {
  // list all available apps
});

app.get('/app', function() {
  // serve index.html of app listed
});

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