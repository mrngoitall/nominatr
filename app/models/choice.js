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
    ignore: {
        type: Boolean,
        default: 0
    },
    votes: [{ 
        type: Schema.Types.ObjectId, ref: 'Vote' 
    }]
});

/**
 * Validations
 */
ChoiceSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
ChoiceSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('poll vote').exec(cb);
    }
};

mongoose.model('Choice', ChoiceSchema);