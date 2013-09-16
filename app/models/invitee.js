/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
 * Invitee Schema
 */
var InviteeSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, ref: 'User' 
  },
  poll: { 
    type: Schema.Types.ObjectId, ref: 'Poll' 
  },
  invited: {
    type: Date,
    default: Date.now
  },
  pollEmailUid: {
    type: String,
    default: Math.round((new Date().valueOf() * Math.random())) + ''
  }
});

/**
 * Validations
 
InviteeSchema.path('name').validate(function(name) {
  return name.length;
}, 'Name cannot be blank');
*/

/**
 * Statics
 */
InviteeSchema.statics = {
  load: function(id, cb) {
    this.find({
      poll: id
    }).populate('user poll').exec(cb);
  }
};

mongoose.model('Invitee', InviteeSchema);