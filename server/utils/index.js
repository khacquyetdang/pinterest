var jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../config/config.json');

const HttpStatus = require('http-status-codes');

/**
 * 
 * @param {*} req 
 */
exports.getTokenFromReq = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}
/**
 * 
 * @param {*} res 
 * @param {*} err 
 */
exports.handleError = (res, err, status) => {
    return res.status(status)
        .send({
            error: {
                msg: __("Authentication needed, please login to access to this page")
            }
        });
}

// Generate Unique Identifier for the access token 
const genJti = () => {
    var jti = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return jti;
}
exports.genJti;

exports.createIdToken = (user) => {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60 * 60 * 5 });
}

exports.createAccessToken = (usermail, userid) => {
    return jwt.sign({
        iss: config.issuer,
        aud: config.audience,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
        scope: 'full_access',
        sub: "lalaland|gonto",
        jti: genJti(), // unique identifier for the token
        alg: 'HS256',
        mail: usermail,
        userid: userid
    }, config.secret);
}
