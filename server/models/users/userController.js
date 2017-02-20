const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const errorMessage = 'Server error, bummer! Please e-mail timkang@unc.edu';

function getErrorMessage(err) {
    let message = '';

    if (err.code) {
        message = errorMessage;
    } else {
        for (const errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

function deleteSensitiveFields(user) {
    return {
        first:    user.first,
        last:     user.last,
        username: user.username,
        email:    user.email,
        id:       user.id
    };
}

exports.login = (req, res, next) => {
    User.findOne({
        $or: [
            { email: { $regex: new RegExp(req.body.user, 'i') } },
            { username: { $regex: new RegExp(req.body.user, 'i') } }
        ]
    }, (err, user) => {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.status(401).send(`Could not find user: \'${req.body.user}\'`);
        } else if (user.hashPassword(req.body.password) !== user.password) {
            return res.status(401).send('Invalid password');
        } else {
            user = deleteSensitiveFields(user);

            const token = jwt.sign({
                id:       user.id,
                username: user.username,
            }, 'babyblue');
            return res.send({ user, token });
        }
    });
};

exports.register = (req, res, next) => {
    User.find({
        $or: [
            { email: req.body.email },
            { username: req.body.username }
        ]
    }, (err, user) => {
        if (err) {
            return res.status(500).send(getErrorMessage(err));
        } else if (!req.user) {
            if (!user.length) {
                if (req.body.password !== req.body.password2) {
                    return res.status(500).send('Passwords do not match');
                }
                user = {
                    first:    req.body.first,
                    last:     req.body.last,
                    username: req.body.username,
                    email:    req.body.email,
                    password: req.body.password
                };

                if (req.body.fbInfo !== null) {
                    user.provider = 'facebook';
                } else {
                    user.provider = 'local';
                }

                user = new User(user);
                user.save((err2, data) => {
                    if (err2) {
                        return res.status(500).send(getErrorMessage(err2));
                    } else {
                        const token = jwt.sign({
                            username: user.username,
                            id:       data.id
                        }, 'babyblue');
                        user = deleteSensitiveFields(user);
                        return res.send({ user, token });
                    }
                });
            } else {
                return res.status(500).send('User or Email already exists');
            }
        } else {
            return res.status(500).send('You are already logged in');
        }
    });
};

exports.getUser = (req, res, next) => {
    jwt.verify(req.params.id, 'babyblue', (notJWT, data) => {
        let jwtuser = '';
        if (!notJWT) {
            jwtuser = data.username;
        }

        User.findOne({
            $or: [
                { providerId: req.params.id },
                { username: jwtuser }
            ]
        }, (err, user) => {
            if (err) {
                res.status(500).send(getErrorMessage(err));
            } else if (user) {
                user = deleteSensitiveFields(user);
                const token = jwt.sign({
                    id:       user.id,
                    username: user.username
                }, 'babyblue');
                return res.send({ user, token });
            } else {
                return res.status(404).send('No user found');
            }
        });
    });
};

exports.getPlayers = (req, res, next) => {
    User.find({}, 'first last username', (err, user) => {
        if (err) {
            res.status(500).send({ error: getErrorMessage(err) });
        } else {
            return res.send(user);
        }
    });
};

//
// exports.getSession = function(req, res, next) {
//     return res.send({ first: req.session.first, last: req.session.last, email: req.session.email, provider: req.session.provider, providerId: req.session.providerId });
// };
