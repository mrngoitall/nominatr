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
  load: function(userId, pollId, cb) {
    console.log('arguments are ',arguments);
    this.find({
      user: userId,
      poll: pollId
    }).exec(cb);
  }
};

mongoose.model('Vote', VoteSchema);