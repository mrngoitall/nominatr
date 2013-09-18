/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Poll = mongoose.model('Poll'),
  Choice = mongoose.model('Choice'),
  Vote = mongoose.model('Vote'),
  Invitee = mongoose.model('Invitee'),
  _ = require('underscore');


/**
 * Find poll by id
 */
exports.vote = function(req, res, next, id) {
  Vote.load(id, function(err, vote) {
    if (err) return next(err);
    if (!vote) return next(new Error('Failed to load votes for ' + id));
    // Convert the results into a nice nested object for angular to easily use in a template
    var voteObj = {};
    for (var i = 0; i < vote.length; i++) {
      voteObj[vote[i].user] = voteObj[vote[i].user] || {};
      voteObj[vote[i].user][vote[i].choice] = vote[i].vote;
    }
    req.voteObj = voteObj;
    next();
  });
};

/**
 * Create a poll
 */
exports.create = function(req, res) {
/*  var poll = new Poll({
    name: req.body.name,
    choices: [],
    invitees: []
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
      // Add the owner as the first invitee
      var invitee = new Invitee({
        user: req.user,
        poll: poll._id
      });
      invitee.save(function(err) {
        poll.invitees.push(invitee._id);
      });

      // Add choices to the poll
      var pollChoices = [];
      var choiceSave = function(err, savedChoice) {
        poll.choices.push(savedChoice._id);
        poll.save();
        var vote = new Vote({
          poll: poll._id,
          user: req.user,
          choice: savedChoice._id
        });
        vote.save(function(err, savedVote) {
          savedChoice.votes.push(savedVote._id);
          savedChoice.save();
        });
      };
      for (var i = 0; i < req.body.choices.length; i++) {
        if (req.body.choices[i].message !== undefined && req.body.choices[i].message.length) {
          var choice = new Choice({
            poll: poll._id,
            name: req.body.choices[i].message,
            order: i
          });
          choice.save(choiceSave);
        }
      }
      res.jsonp(poll);
    }
  });*/
};

/**
 * Update a poll
 */
exports.update = function(req, res) {
  // On the front end, if the user changes a choice, 
  // it should delete the old choice, and add a new choice
  console.log('req.body',req.body);
  var poll = req.poll;
  console.log('Updating poll',poll);
  poll = _.extend(poll, req.body);

  poll.save(function(err) {
    res.jsonp(poll);
  });
};

/**
 * Delete an vote
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
 * Show an vote
 */
exports.show = function(req, res) {
  res.jsonp(req.voteObj);
};
