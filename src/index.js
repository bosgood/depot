var express = require('express');
var chalk = require('chalk');
var bodyParser = require('body-parser');

const PORT = 3000;

var Connection = require('./connections/redis-connection');
connection = new Connection().connect();

var app = express()
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
;

// list available apps
app.get('/apps', require('./routes/list-apps')(connection));

// list available app versions
app.get('/apps/:id/versions', require('./routes/list-versions')(connection));

// get individual app information
app.get('/apps/:id', require('./routes/show-app')(connection));

// app/update an application
var addUpdateRoute = require('./routes/update-app')(connection);
app.post('/apps/:id', addUpdateRoute);
app.put('/apps/:id', addUpdateRoute);

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