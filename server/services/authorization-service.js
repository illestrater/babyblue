const jwt = require('jsonwebtoken');

exports.getUser = (token) => {
    try {
        return jwt.verify(token, 'cue');
    } catch (err) {
        console.log('JWT ERROR: ', err);
        return null;
    }
};
