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
  location: {
    type: String,
    default: '',
    trim: true
  },
  updated: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  gname: {
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
  privacy: {
    type: String,
    default: 'Public'
  },
  invitees: [{
    type: Schema.Types.ObjectId, ref: 'Invitee'
  }]
});

/**
 * Validations
 */
PollSchema.path('name').validate(function(name) {
  if (name) {
    return name.length;
  } else {
    return 0;
  }
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