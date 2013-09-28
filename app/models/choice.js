/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;


/**
 * Choice Schema
 */
var ChoiceSchema = new Schema({
  poll: { 
    type: Schema.Types.ObjectId, ref: 'Poll' 
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  fullAddress: {
    type: String,
    default: '',
    trim: true
  },
  gid: {
    type: String,
    default: '',
    trim: true
  },
  gref: {
    type: String,
    default: '',
    trim: true
  },
  gurl: {
    type: String,
    default: '',
    trim: true
  },
  priceLevel: {
    type: Number,
    default: 0
  },
  grating: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  ignore: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  votes: [{ 
    type: Schema.Types.ObjectId, ref: 'Vote' 
  }]
});

/**
 * Statics
 */
ChoiceSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('poll votes').exec(cb);
  }
};

mongoose.model('Choice', ChoiceSchema);