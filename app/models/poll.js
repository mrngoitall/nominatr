/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
 * Poll Schema
 */
var PollSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  choices: [{ 
    type: Schema.Types.ObjectId, ref: 'Choice' 
  }],
  invitees: [{
    type: Schema.Types.ObjectId, ref: 'Invitee'
  }]
});

/**
 * Validations
 */
PollSchema.path('name').validate(function(name) {
  return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
PollSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('owner choices invitees').exec(cb);
  }
};

mongoose.model('Poll', PollSchema);