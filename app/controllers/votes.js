/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  Poll = mongoose.model('Poll'),
  Choice = mongoose.model('Choice'),
  Vote = mongoose.model('Vote'),
  User = mongoose.model('User'),
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
      voteObj[vote[i].user._id] = voteObj[vote[i].user._id] || {};
      voteObj[vote[i].user._id].name = vote[i].user.name;
      voteObj[vote[i].user._id][vote[i].choice] = vote[i].vote;
    }
    // Saving vote object for later updates
    req.vote = vote;
    // Saving nested vote object to send
    req.voteObj = voteObj;
    next();
  });
};

/**
 * Create a (guest) vote
 */
exports.create = function(req, res) {
  if (req.user === undefined) {
    // Create a new user too,
    // so we can log them in and give them a cookie
    var user = new User({
      name: req.body.guest.name,
      password: 'somepassword',
      provider: 'local'
    });
    user.save(function(err,savedUser) {
      if (err) {
        console.log(err);
      }
      req.logIn(savedUser, function(err) {
        if (err) {
          console.log(err);
        }
      });
      // Now we can actually record their vote!
      var invitee = new Invitee({
        user: savedUser._id,
        poll: req.poll._id
      });
      invitee.save(function(err) {
        req.poll.invitees.push(invitee._id);
        req.poll.save();
      });
      for (var choice in req.body.guest) {
        if (choice !== 'name') {
          var vote = new Vote({
            poll: req.poll._id,
            user: savedUser._id,
            choice: choice,
            vote: req.body.guest[choice]
          });
          vote.save();
        }
      }
      res.redirect(req.originalUrl);
    });
  }
};

/**
 * Update a vote
 */
exports.update = function(req, res) {
  var vote = req.vote;
  for (var i = 0; i < vote.length; i++) {
    var currentVote = req.body[vote[i].user._id][vote[i].choice];
    if (vote[i].vote !== currentVote) {
      vote[i].vote = currentVote;
      vote[i].save();
    }
    if (i === vote.length-1) {
      res.jsonp(req.body);
    }
  }
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
