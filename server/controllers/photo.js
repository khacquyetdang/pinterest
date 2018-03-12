const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const Photo = require('../models/Photo');

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
            return Photo.find({ owner: existingUser.id }).populate('owner', 'email').exec(function (err, photos) {
                if (err) {
                    return res.status(HttpStatus.CONFLICT).send({
                        error: {
                            msg: err
                        }
                    });
                }
    
                return res.status(HttpStatus.OK).send({
                    msg: __("The photo is added"),
                    photos: photos
                });    
            });
        });

    });
}

/**
 * POST /vote
 * like or un like photos.
 */
exports.delete = (req, res) => {
    var photoId = req.params.photoId;
    var userid = req.user.userid;
 
    Photo.remove({
        _id: photoId
    }, (err) => {
        if (err) {
            return res.status(HttpStatus.CONFLICT).send({
                error: {
                    msg: err,
                }
            });
        }
        return Photo.find({ owner: userid }).populate('owner', 'email').exec(function (err, photos) {
            if (err) {
                return res.status(HttpStatus.CONFLICT).send({
                    error: {
                        msg: err
                    }
                });
            }

            return res.status(HttpStatus.OK).send({
                photos: photos,
                msg: __("This photo is deleted")
            });

        });
    });
}

/**
 * POST /vote
 * like or un like photos.
 */
exports.vote = (req, res) => {
    var photoId = req.params.photoId;

    Photo.findOne({
        _id: photoId
    }, {
            "likes": {
                $elemMatch: { email: req.user.mail }
            }
        }, (err, existingPhoto) => {
            if (err) {
                return res.status(HttpStatus.CONFLICT).send({
                    error: {
                        msg: err,
                        case: "err db"
                    }
                });
            }
            if (!existingPhoto) {
                return res.status(HttpStatus.CONFLICT).send({
                    error: {
                        msg: __("This photo is not existed")
                    }
                });
            }


            if (existingPhoto.likes.length >= 1) {
                // unlike
                Photo.update({
                    _id: photoId,
                    likes: {
                        $elemMatch: { email: req.user.mail }
                    }
                },
                    {
                        $inc: { likeCount: -1 },
                        $pull: { likes: { email: req.user.mail } }
                    },
                    function (err, rawResponse) {
                        if (err) {
                            return res.status(HttpStatus.CONFLICT).send({
                                error: {
                                    msg: err,
                                    case: "unlike"
                                }
                            });
                        }
                        return getAllPhotos(req, res, null);
                    });
            }
            else {
                // like
                Photo.update({
                    _id: photoId,
                    /*likes: {
                        email: { $ne: req.user.mail }
                    }*/
                },
                    {
                        $inc: { likeCount: 1 },
                        $push: { likes: { email: req.user.mail } }
                    },
                    function (err, rawResponse) {
                        if (err) {
                            return res.status(HttpStatus.CONFLICT).send({
                                error: {
                                    msg: err,
                                    rawResponse: rawResponse,
                                    case: "like"
                                }
                            });
                        }
                        return getAllPhotos(req, res, null);

                    }
                );
            }

        });
}

/**
 * GET /add
 * get photos.
 */
exports.myphoto = (req, res) => {
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

        Photo.find({ owner: existingUser.id }).populate('owner', 'email').exec(function (err, photos) {
            if (err) {
                return res.status(HttpStatus.CONFLICT).send({
                    error: {
                        msg: err
                    }
                });
            }

            return res.status(HttpStatus.OK).send({
                photos: photos
            });

        });
    });
}
/**
 * GET /add
 * get photos.
 */
exports.get = (req, res) => {

    getAllPhotos(req, res, null);
}

function getAllPhotos(req, res, msg) {
    Photo.find({}).populate('owner', 'email').exec(function (err, photos) {
        if (err) {
            return res.status(HttpStatus.CONFLICT).send({
                error: {
                    msg: err
                }
            });
        }

        return res.status(HttpStatus.OK).send({
            photos: photos,
            msg : msg
        });

    });
}
