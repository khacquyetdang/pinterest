const HttpStatus = require('http-status-codes');

/**
 * 
 * @param {*} req 
 */
const getTokenFromReq = (req) => {
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
function handleError(res, err, status) {
    return res.status(status)
        .send({
            error: {
                msg: __("Authentication needed, please login to access to this page")
            }
        });
}