/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Poll = mongoose.model('Poll'),
  Choice = mongoose.model('Choice'),
  Vote = mongoose.model('Vote'),
  _ = require('underscore');


/**
 * Find poll by id
 */
exports.poll = function(req, res, next, id) {
  Poll.load(id, function(err, poll) {
    if (err) return next(err);
    if (!poll) return next(new Error('Failed to load poll ' + id));
    req.poll = poll;
    next();
  });
};

/**
 * Create a poll
 */
exports.create = function(req, res) {
  var poll = new Poll({
    name: req.body.name,
    choices: []
  });
  poll.owner = req.user;

  poll.save(function(err) {
    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        poll: poll
      });
    }
    else {
      var pollChoices = [];
      console.log(req.body);
      for (var i = 0; i < req.body.choices.length; i++) {
        if (req.body.choices[i].message !== undefined && req.body.choices[i].message.length) {
          var choice = new Choice({
            poll: poll._id,
            name: req.body.choices[i].message
          });
          choice.save(function(err, savedChoice) {
            poll.choices.push(savedChoice._id);
            poll.save();
          });
        }
      }
      res.jsonp(poll);
    }
  });
};

/**
 * Update a poll
 */
exports.update = function(req, res) {
  var poll = req.poll;

  poll = _.extend(poll, req.body);

  poll.save(function(err) {
    res.jsonp(poll);
  });
};

/**
 * Delete an poll
 */
exports.destroy = function(req, res) {
  var poll = req.poll;

  poll.remove(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(poll);
    }
  });
};

/**
 * Show an poll
 */
exports.show = function(req, res) {
  res.jsonp(req.poll);
};

/**
 * List of Polls
 */
exports.all = function(req, res) {
  Poll.find().sort('-created').populate('user').exec(function(err, polls) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(polls);
    }
  });
};
