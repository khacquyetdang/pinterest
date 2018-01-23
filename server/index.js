/* eslint consistent-return:0 */

const express = require('express');
var cors = require('cors')
var i18n = require("i18n");
const logger = require('./logger');
var jwt = require('express-jwt');
const HttpStatus = require('http-status-codes');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
//const sass = require('node-sass-middleware');
const multer = require('multer');
const configCors = require('./config/cors');
const jwtconfig = require('./config/config.json');
const utils = require('./utils/index');
const User = require('./models/User');

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
app.use(cors())

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


app.use(passport.initialize());
app.use(passport.session());
app.use(cors(configCors.corsOptions));
/*
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
// @TODO check why requireScope is not work
/*function requireScope(scope) {
  return function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(HttpStatus.UNAUTHORIZED)
        .send({
          error: {
            msg: __("Authentication needed, please login to access to this page")
          }
        });
    }

    var userid = req.user.userid;
    var has_scopes = req.user.scope === scope;
    var access_token = utils.getTokenFromReq(req);
    //if (!has_scopes) {
    return res.status(HttpStatus.UNAUTHORIZED)
      .send({
        error: {
          msg: __("Authentication needed, please login to access to this page")
        }
      });
    return ;
    //}
    User.findOne({
      _id: userid
    }, function (err, existingUser) {
      if (err) {
        utils.handleError(res, err, HttpStatus.CONFLICT);
        return;
      }
      if (!existingUser) {
        utils.handleError(res, __("Authentication needed, please login to access to this page"), HttpStatus.CONFLICT);
        return;
      }
      utils.handleError(res, __("Authentication needed, please login to access to this page"), HttpStatus.CONFLICT);

      //next();
    });
  };
}*/

/*
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});*/

app.post('/auth/twitter/token',
  passport.authenticate('twitter-token'),
  function (req, res) {
    // do something with req.user
    res.send(req.user ? 200 : 401);
  }
);


router.route('/api/auth/twitter/reverse')
  .post(function (req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: process.env.TWITTER_KEY,
        consumer_secret: process.env.TWITTER_SECRET
      }, function(err, r, body) {
        if (err) {
          return res.send(500, { message: e.message });
        }

        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      });
  });


app.get('/api/auth/facebook/token',
  (req, res) => {
    passport.authenticate('facebook-token',
      function (err, user, info) {        // do something with req.user
        console.log('insde endpoint');
        console.log("user", user);
        console.log("err ", err);
        console.log("info ", info);

        if (err) {
          return res.status(HttpStatus.CONFLICT).send(
            {
              error: {
                msg: err
              }
            }
          );
        }
        if (!user) {
          return res.status(HttpStatus.UNAUTHORIZED).send(
            {
              error: {
                msg: __("Authentication needed, please login to access to this page")
              }
            }
          );
        }
        else {
          return res.status(HttpStatus.OK).send(
            {
              msg: __("Authentication Ok"),
              access_token: info.access_token
            }
          );
        }
      })(req, res);
  });


/**
 * custome middle where to check jwt
 */
const isAuthenticatedWithJwtToken = (req, res, next) => {
  //res.sendStatus(401);

  var userid = req.user.userid;
  var access_token = utils.getTokenFromReq(req);
  User.findOne(
    { _id: userid },
    {
      "jwttokens": {
        $elemMatch:
          {
            access_token: access_token, enabled: true
          }
      }
    }, function (err, existingUser) {
      console.log("check jwt token with db");

      if (err) {
        utils.handleError(res, err, HttpStatus.CONFLICT);
        return;
      }

      if (!existingUser) {
        utils.handleError(res, __("Authentication needed, please login to access to this page"), HttpStatus.CONFLICT);
        return;
      }

      if (existingUser.jwttokens.length >= 1) {
        next();
      }
      else {
        utils.handleError(res, __("Authentication needed, please login to access to this page"), HttpStatus.CONFLICT);
        return;
      }

    });
}

app.use(function (err, req, res, next) {
  console.log("app use");
  if (err.name.startsWith('UnauthorizedError')
    || err.name.startsWith("Malformed access token")) {
    //utils.errorHandler
    return res.status(HttpStatus.UNAUTHORIZED)
      .send({
        error: {
          msg: __("Authentication needed, please login to access to this page")
        }
      });
  }
});

//app.post('/api/photo', jwtCheck);
//app.post('/api/photo', requireScope);



app.post('/api/signup', userController.postSignup);
app.post('/api/login', userController.postLogin);

// app.post('/api/photo', jwtCheck, requireScope('full_access'), photoController.add);
//app.post('/api/photo', photoController.add);
app.post('/api/photo', function (req, res) {
  res.send("J'enlve tout");
});

app.delete('/api/photo/:photoId', photoController.delete);

//app.post('/api/photo/vote/:photoId', jwtCheck, requireScope('full_access'), photoController.vote);
app.get('/api/myphoto', [jwtCheck, isAuthenticatedWithJwtToken], photoController.myphoto);

app.get('/api/photo', photoController.get);

//app.get('/api/logout', jwtCheck, requireScope('full_access'), userController.logout);
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
