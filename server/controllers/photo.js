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
    req.assert('url', __('Photo url is not valid')).isURL();
    req.assert('description', __('Description cannot be blank')).notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            error: {
                form: errors,
            }
        });
    }

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
                    msg: __("User is not registered yet")
                }
            });
        }
        const photo = new Photo({
            owner: existingUser.id,
            url: req.body.url,
            description: req.body.description,
            likeCount: 0,
            likes: [],
        });

        photo.save(err => {
            if (err) {
                return res.status(HttpStatus.CONFLICT).send({
                    error: {
                        msg: err
                    }
                });
            }
            return res.status(HttpStatus.OK).send({
                msg: __("The photo is added")
            });

        });

    });
}
