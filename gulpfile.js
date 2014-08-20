var gulp   = require('gulp');
var scp2   = require('scp2');
var ssh    = require('gulp-ssh');
var nconf  = require('nconf');
var path   = require('path');
var chalk  = require('chalk');
var uuid   = require('node-uuid');
var runSequence = require('run-sequence');
var fs     = require('fs');
var rimraf = require('gulp-rimraf');

nconf.argv().env();

const ENV = nconf.get('ENV') || 'dev';

function exitWithError(errorMessage) {
  console.error(chalk.red(errorMessage));
  throw new Error(errorMessage);
}

// Gets a unique version number
// 2014-08-16--a4d4bd9f-c7f5-4ffb-917e-1732892d97df
function createVersionNumber() {
  return new Date().toJSON().slice(0, 10) + '--' + uuid.v4();
}

gulp.task('clean', function() {
  return gulp.src('tmp')
    .pipe(rimraf({ force: true }));
});

gulp.task('check-env', function() {
  if (ENV === 'dev') {
    exitWithError('cannot deploy into the `dev` environment.');
  }
});

gulp.task('prepare', function() {
  var envFile = path.join('config', ENV + '.json');
  nconf.file(envFile);
  var version = createVersionNumber();
  nconf.set('version', version);
  return gulp.src(['src/*', envFile])
    .pipe(gulp.dest(path.join('tmp', version)));
});

gulp.task('upload', function(callback) {
  var version = nconf.get('version');
  var deployRootPath = nconf.get('deploy:path');

  var scpParams = {
    host: nconf.get('deploy:host'),
    port: nconf.get('deploy:port'),
    username: nconf.get('deploy:user'),
    // privateKey: ''
    // password: ''  // auth methods handled below
    path: deployRootPath
  };

  // Allow privateKey or password authentication to server
  var password, privateKeyPath;
  if (password = nconf.get('deploy:password')) {
    scpParams.password = password;
  } else if (privateKeyPath = nconf.get('deploy:privateKey')) {
    scpParams.privateKey = fs.readFileSync(privateKeyPath);
  }

  var envString;
  if (ENV === 'qa') {
    envString = chalk.yellow(ENV);
  } else if (ENV === 'prod') {
    envString = chalk.red(ENV);
  } else {
    envString = chalk.blue(ENV);
  }

  console.log(
    chalk.yellow('DEPLOYING!'), '\n',
    chalk.green('environment:'), envString, '\n',
    chalk.green('version:'), version, '\n',
    chalk.green('server:'), scpParams.host, '\n',
    chalk.green('port:'), scpParams.port, '\n',
    chalk.green('user:'), scpParams.username, '\n',
    chalk.green('directory:'), scpParams.dest || scpParams.path
  );

  return scp2.scp('tmp', scpParams, callback);
});

// Deploys the code
gulp.task('deploy', function(callback) {
  return runSequence(
    'check-env',
    'prepare',
    'upload',
    'clean',
    callback
  );
});

gulp.task('set-latest', function() {
  var envFile = path.join('config', ENV + '.json');
  nconf.file(envFile);
  var version = nconf.get('deployVersion');
  if (!version) {
    exitWithError('must specify a version to deploy (deployVersion=XXX-XXX).');
  }

  var privateKeyFile = nconf.get('deploy:privateKey');
  if (!privateKeyFile) {
    exitWithError('must specify a private key file (privateKey=./key.pem).');
  }

  var privateKey = fs.readFileSync(privateKeyFile);
  var deployRootPath = nconf.get('deploy:path');
  var deployVersionPath = path.join(deployRootPath, version);
  var deployLatestPath = path.join(deployRootPath, 'latest');

  return ssh.exec({
    command: [
      // // install NPM dependencies
      // "npm install",
      // symlink /depot/<version> to /depot/latest
      "rm " + deployLatestPath,
      "ln -sf " + deployVersionPath + ' ' + deployLatestPath
      // // bounce the server
      // "forever " + deployLatestPath + " stop"
    ],
    sshConfig: {
      host: nconf.get('deploy:host'),
      port: nconf.get('deploy:port'),
      username: nconf.get('deploy:user'),
      privateKey: privateKey
    }
  });
});

gulp.task('deploy-latest', ['deploy', 'set-latest']);
