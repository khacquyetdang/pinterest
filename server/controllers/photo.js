const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Photo = require('../models/Photo');

const config = require('./config.json');
const HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
const _ = require('lodash');


/**
 * POST /add
 * Add a photo.
 */
exports.add = (req, res) => {
    req.assert('url', 'Photo url is not valid').isURL();
    req.assert('description', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });


    User.findOne({
        email: req.user.mail
    }, (err, existingUser) => {
        if (err) {
            return res.status(HttpStatus.CONFLICT).send({
                error: {
                    msg: err
                }
            });
        }

        if (!existingUser) {
            return res.status(HttpStatus.CONFLICT).send({
                error: {
                    msg: "User is not registered yet"
                }
            });
        }
        else {
            var access_token = getToken(req);
            var jwttokens = existingUser.jwttokens;
            User.findOne(
                { _id: existingUser._id },
                {
                    "jwttokens": {
                        $elemMatch:
                            {
                                access_token: access_token, enabled: false
                            }
                    }
                }, function (err, userWithTokens) {

                    if (err) {
                        return res.status(HttpStatus.OK).send({
                            msg: err
                        });
                    };
                    if (userWithTokens.jwttokens.length >= 1) {
                        return res.status(HttpStatus.OK).send({
                            msg: "already logout",
                            access_token: access_token
                        });
                    }
                    //existingUser.jwttokens = jwttokens;
                    User.update({ _id: existingUser._id, "jwttokens.access_token": access_token }, {
                        $set:
                            { "jwttokens.$.enabled": false }
                    }, function (err) {
                        if (err) {
                            return res.status(HttpStatus.CONFLICT).send({
                                error: {
                                    msg: err
                                }
                            });
                        }
                        return res.status(HttpStatus.OK).send(
                            {
                                msg: "OK",
                                jwttokens: jwttokens,
                                access_token: access_token
                            }
                        );
                    });
                });
        }
    });
}
