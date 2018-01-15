/* eslint consistent-return:0 */

const express = require('express');
var i18n = require("i18n");
const logger = require('./logger');
var jwt = require('express-jwt')
const HttpStatus = require('http-status-codes');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
//const sass = require('node-sass-middleware');
const multer = require('multer');
const jwtconfig = require('./controllers/config.json');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.developpement' });

const userController = require('./controllers/user');
const photoController = require('./controllers/photo');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');


const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
console.log("env MONGODB_URI", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


// minimal config
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/locales',
  defaultLocale: 'fr',
  autoReload: true,
  queryParameter: 'lang',
  register: global
});

//app.use(expressStatusMonitor());
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));

if (process.env.NODE_ENV === 'development') {
  //app.use(logger('dev'));
  //app.use(errorHandler())
}

/*
app.use(passport.initialize());
app.use(passport.session());

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});*/

// routing 
app.use(i18n.init);

var jwtCheck = jwt({
  secret: jwtconfig.secret,
  audience: jwtconfig.audience,
  issuer: jwtconfig.issuer,
  errorOnFailedAuth: false
});

// Check for scope
function requireScope(scope) {
  return function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(HttpStatus.UNAUTHORIZED)
        .send({
          error: {
            msg: __("Authentication needed, please login to access to this page")
          }
        });
    }

    var has_scopes = req.user.scope === scope;
    if (!has_scopes) {
      res.status(HttpStatus.UNAUTHORIZED)
        .send({
          error: {
            msg: __("Authentication needed, please login to access to this page")
          }
        });
      return;
    }
    next();
  };
}

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(HttpStatus.UNAUTHORIZED)
      .send({
        error: {
          msg: __("Authentication needed, please login to access to this page")
        }
      });
  }
});


app.use('/api/protected', jwtCheck, requireScope('full_access'));


app.get('/api/hello', function (req, res) {

  res.status(200).send({
    msg: __("Hello"),
  });
});
app.post('/api/hello', function (req, res) {

  res.status(200).send({
    msg: __("Hello"),
  });
});



app.get('/api/protected/random-quote', function (req, res) {

  res.status(200).send({
    msg: "Work hard, play hard, success will come",
    req: req.user
  });
});


app.post('/api/signup', userController.postSignup);
app.post('/api/login', userController.postLogin);
app.post('/api/photo', jwtCheck, requireScope('full_access'), photoController.add);
app.get('/api/logout', jwtCheck, requireScope('full_access'), userController.logout);
/*app.post('/api/signup', function (req, res, next) {
  res.send('hello postvcefd');
});*/

/**
 * Error Handler.
 */
//app.use(errorHandler());

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
