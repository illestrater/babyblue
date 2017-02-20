const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first: {
        type: String,
        trim: true
    },
    last: {
        type: String,
        trim: true
    },
    username: {
        type:  String,
        trim:  true,
        index: true
    },
    email: {
        type:   String,
        trim:   true,
        unique: true,
        match:  [/.+\@.+\..+/, 'Please fill a valid e-mail address']
    },
    password: {
        type:     String,
        validate: [
            (password) => {
                if (password && password.length >= 6) {
                    return true;
                }
                return false;
            },
            'Password must be six characters or more'
        ]
    },
    salt: {
        type: String
    },
    provider: {
        type:     String,
        required: 'Provider is required'
    },
    providerId:   String,
    providerData: {},
    joined:       {
        type:    Date,
        default: Date.now
    },
    player: {
        handling:  Number,
        endurance: Number,
        quickness: Number,
        height:    Number,
        shooting:  Number,
        power:     Number,
        bio:       String
    }
});


UserSchema.pre('save', function _saltPassword(next) {
    if (this.password && this.isNew) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function _hashPassword(password) {
    const hashed = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
    return hashed;
};

UserSchema.methods.authenticate = function _authenticate(password) {
    const authenticated = this.password === this.hashPassword(password);
    return authenticated;
};

UserSchema.statics.findUniqueUsername = function findUniqueUsername(username, suffix, callback) {
    const User = this;
    const possibleUsername = username + (suffix || '');

    User.findOne({ username: possibleUsername }, (err, user) => {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return User.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.set('toJSON', {
    getters:  true,
    virtuals: true
});

mongoose.model('User', UserSchema);
