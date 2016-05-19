var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: Number,
  username: String,
  password: String,
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('attemptedPassword, this.password', attemptedPassword, this.password);
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    console.log('isMatch', isMatch);
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      console.log('hashing password! it is now', hash);
      this.password = hash;
    });
};


userSchema.post('init', function(model) {
  model.hashPassword();
});

var User = mongoose.model('User', userSchema);


// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
