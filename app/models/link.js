var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


var linkScheme = mongoose.Schema({
  id: Number,
  url: String,
  baseUrl: String,
  code: String, 
  title: String,
  visits: {type: Number, default: 0},
  createdAt: Date,
  updatedAt: Date
});

linkScheme.post('validate', function(model) {
  var shasum = crypto.createHash('sha1');
  shasum.update(model.url);
  model.code = shasum.digest('hex').slice(0, 5);
  console.log('model url and code:', model.url, model.code);
});

var Link = mongoose.model('Link', linkScheme);

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
