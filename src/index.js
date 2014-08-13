var express = require('express');
var chalk = require('chalk');
var app = express();

const PORT = 3000;

var Connection = require('./connections/redis-connection');
connection = new Connection().connect();

// list available apps
app.get('/apps', require('./routes/list-apps')(connection));

// list available app versions
app.get('/apps/:id/versions', require('./routes/list-versions')(connection));

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