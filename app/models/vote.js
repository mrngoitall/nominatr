/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
 * Vote Schema
 */
var VoteSchema = new Schema({
  poll: { 
    type: Schema.Types.ObjectId, ref: 'Poll' 
  },
  user: { 
    type: Schema.Types.ObjectId, ref: 'User' 
  },
  choice: { 
    type: Schema.Types.ObjectId, ref: 'Choice' 
  },
  order: {
    type: Number,
    default: 0
  },
  vote: {
    type: Number,
    default: 0
  }
});

/**
 * Validations
 
VoteSchema.path('name').validate(function(name) {
  return name.length;
}, 'Name cannot be blank');
*/

/**
 * Statics
 */
VoteSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('poll user choice').exec(cb);
  }
};

mongoose.model('Vote', VoteSchema);