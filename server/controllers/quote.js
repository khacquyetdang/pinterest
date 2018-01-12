const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const config = require('./config.json');
const HttpStatus = require('http-status-codes');
var jwt = require('express-jwt'),
const _ = require('lodash');

var jwtCheck = jwt({
    secret: config.secret,
    audience: config.audience,
    issuer: config.issuer
});


