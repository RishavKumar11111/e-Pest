var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var crypto = require('crypto');
var uuid = require('uuid/v4');
var xFrameOptions = require('x-frame-options');
var device = require('express-device');
var bodyParser = require('body-parser');

var homeRouter = require('./routes/home');
var vawRouter = require('./routes/vaw');
var vawAppRouter = require('./routes/vawApp');
var aaoRouter = require('./routes/aao');
var aaoAppRouter = require('./routes/aaoApp');
var adoRouter = require('./routes/ado');
var adoAppRouter = require('./routes/adoApp');
var cdaoRouter = require('./routes/cdao');
var ouatRouter = require('./routes/ouat');
var jdappRouter = require('./routes/jdapp');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cpRouter = require('./routes/changePassword');
var emergencyAppRouter = require('./routes/emergencyApp');
var graphRouter = require('./routes/graph');
var adminRouter = require('./routes/admin');
var adaptRouter = require('./routes/adapt');
var nrriRouter = require('./routes/nrri');

var app = express();

app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true
    // secure: auto,
    // expires: 10000
  },
  genid: function() {
    return uuid();
  }
}));

app.use(xFrameOptions());
app.use(device.capture());
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.disable('x-powered-by');

// static paths
app.use('/public', express.static('public'));
app.use('/gigw', express.static('gigw'));
app.use('/gentelella', express.static('gentelella'));
app.use('/app_login', express.static('app_login'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/vaw', vawRouter);
app.use('/vawApp', vawAppRouter);
app.use('/aao', aaoRouter);
app.use('/aaoApp', aaoAppRouter);
app.use('/ado', adoRouter);
app.use('/adoApp', adoAppRouter);
app.use('/cdao', cdaoRouter);
app.use('/ouat', ouatRouter);
app.use('/jdapp', jdappRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/changePassword', cpRouter);
app.use('/emergencyApp' , emergencyAppRouter);
app.use('/graph', graphRouter);
app.use('/admin', adminRouter);
app.use('/adapt', adaptRouter);
app.use('/nrri', nrriRouter);

// options request handler
app.options("/*", function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.epestodisha.nic.in/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/www.epestodisha.nic.in/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/www.epestodisha.nic.in/chain.pem', 'utf8');
// const credentials = {
//  key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

/**
 * Module dependencies.
 */

var debug = require('debug')('e-pest:server');
var http = require('http');
// var https = require('https');

// http.createServer(function (req, res) {
//   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//   res.end();
// }).listen(80);

// var httpServer = express.createServer();
// httpServer.get('*', function(req, res) {
//   res.redirect('https://' + req.headers.host + req.url);
// });

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

// var server = https.createServer(credentials, app);
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;