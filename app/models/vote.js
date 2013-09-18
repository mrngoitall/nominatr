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
    type: Boolean, 
    default: false
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
  load: function(pollId, cb) {
    this.find({
      poll: pollId
    }).populate('user').exec(cb);
  }
};

mongoose.model('Vote', VoteSchema);