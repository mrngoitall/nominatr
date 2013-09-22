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
exports.poll = function(req, res, next, id) {
  Poll.load(id, function(err, poll) {
    if (err) return next(err);
    if (!poll) return next(new Error('Failed to load poll ' + id));
    req.poll = poll;
    // Remove sensitive information from req.poll
    req.poll.owner.facebook = null;
    req.poll.owner.email = null;
    req.poll.owner.hashed_password = null;

    // Add invitee information to poll object
    /*Invitee.load(poll._id, function(err, invitee) {
      if (err) return next(err);
      var inviteeVotes = {};
      // Pull in all votes from this user and store it as a nested object
      var voteLoad = function(err, thisVote) {
        if (err) return next(err);
        inviteeVotes[thisInvitee.user._id] = {};
        inviteeVotes[thisInvitee.user._id].name = thisInvitee.user.name;
        for (var j = 0; j < thisVote.length; j++) {
          inviteeVotes[thisInvitee.user._id][thisVote[j].choice] = thisVote[j].vote;
        }
        if (i === invitee.length) {
          finish();
        }
      };
      for (var i = 0; i < invitee.length; i++) {
        var thisInvitee = invitee[i];
        Vote.load(invitee[i].user._id, poll._id, voteLoad);
      }
      var finish = function() {
        // Stringifying the nested object since Mongoose prevents us from modifying the structure of req.poll
        req.poll.voteJSON = JSON.stringify(inviteeVotes);
      }
    });*/
    next();
  });
};

/**
 * Create a poll
 */
exports.create = function(req, res) {
  var poll = new Poll({
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
        poll.save();
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
      var reqChoices = req.body.choices;
      for (var i = 0; i < reqChoices.length; i++) {
        if (reqChoices[i].name !== undefined && reqChoices[i].name.length) {
          var choice = new Choice({
            poll: poll._id,
            name: reqChoices[i].name,
            order: i
          });
          choice.save(choiceSave);
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
  console.log('req.body',req.body);
  var poll = req.poll;
  console.log('Updating poll',poll);
  poll.name = req.body.name;
  poll.updated = new Date();
  // On the front end, if the user changes a choice,
  // it should set the ignore attribute on the old choice,
  // and add a new choice, with the same order attribute
  // as the "deleted" choice. If the user just deletes
  // the name of a choice, consider it removed,
  // with nothing in its place.
  var reqChoices = req.body.choices;
  for (var i = 0; i < reqChoices.length; i++) {
    // Confirming that the ids match. If they don't, it's probably a new choice
    // If we ever decide to let users change the order of choices, we'll need
    // to revisit this implementation.
    if (poll.choices[i] && reqChoices[i]._id === poll.choices[i]._id+'') {
      if (reqChoices[i].name && reqChoices[i].name !== poll.choices[i].name) {
        console.log('name change detected with ',reqChoices[i]._id);
        // Set the ignore attribute
        Choice.findById(poll.choices[i]._id, function(err,thisChoice) {
          thisChoice.ignore = true;
          thisChoice.save();
        });
        // Create a new Choice and save it
        poll.save(function(err,savedPoll){
        });
      }
    } else {
      // This is a new choice 
      console.log('new choice detected');
    }
  }
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
