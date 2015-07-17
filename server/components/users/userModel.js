var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  user: {
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    },
    nickname: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    password: {
      type: String,
      validate: [
        function(password) {
          return password && password.length >= 6;
        },
        'Password must be six characters or more'
      ]
    }
  },
  player: {
    handling: Number,
    endurance: Number,
    quickness: Number,
    height: Number,
    shooting: Number,
    power: Number,
    bio: String
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    default: Date.now
  }
});

//UserSchema.virtual('fullName').get(function() {
//  return this.first + ' ' + this.last;
//}).set(function(fullName) {
//  var splitName = fullName.split(' ');
//  this.first = splitName[0] || '';
//  this.last = splitName[1] || '';
//});

UserSchema.pre('save', function(next) {
  if(this.user.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.user.password = this.hashPassword(this.user.password);
  }

  next();
});

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.user.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');
  
  _this.findOne({ username: possibleUsername }, function(err, user){
    if(!err) {
      if(!user) {
        callback(possibleUsername);
      } else{
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null)
    }
  });
};

UserSchema.set('toJSON', { 
  getters: true, 
  virtuals: true 
});

mongoose.model('User', UserSchema);