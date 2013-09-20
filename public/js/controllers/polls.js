angular.module('mean.polls').controller('PollsController', ['$scope', '$routeParams', '$location', 'Global', 'Polls', 'Votes', function ($scope, $routeParams, $location, Global, Polls, Votes) {
  $scope.global = Global;

  $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];

  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length+1;
    $scope.choices.push({'id':'choice'+newItemNo});
  };

  $scope.addNewChoiceToExisting = function() {
    var newItemNo = $scope.poll.choices.length+1;
    $scope.poll.choices.push({'id':'choice'+newItemNo});
  };

  // if ($scope.global.user && $scope.global.user._id) {
  //   $scope.currentUser = 'user';
  // } else {
  //   $scope.currentUser = 'guest';
  // }

  $scope.create = function() {
    var poll = new Polls({
      name: this.name,
      choices: this.choices
    });
    poll.$save(function(response) {
      $location.path("polls/" + response._id);
    });

    this.name = "";
  };

  $scope.remove = function(poll) {
    poll.$remove();  

    for (var i in $scope.polls) {
      if ($scope.polls[i] == poll) {
        $scope.polls.splice(i, 1);
      }
    }
  };

  $scope.update = function() {
    var poll = $scope.poll;
    poll.$update(function() {
      $location.path('polls/' + poll._id);
    });
  };

  $scope.createGuestVotes = function() {
    console.log($scope.guestVotes);
    var vote = new Votes({
      'guest': $scope.guestVotes
    });
    vote.$save({
      pollId: $routeParams.pollId
    },function(response) {
      $scope.findOne();
      location.reload();
    });
  };

  $scope.updateVotes = function() {
    var votes = $scope.votes;
    votes.$update({
      pollId: $routeParams.pollId
    }, function() {
    });
  };

  $scope.find = function(query) {
    Polls.query(query, function(polls) {
      $scope.polls = polls;
    });
  };

  $scope.findOne = function() {
    Polls.get({
      pollId: $routeParams.pollId
    }, function(poll) {
      $scope.poll = poll;
      // if ($scope.poll.owner._id == $scope.global.user._id) {
      //   $scope.currentUser = 'owner';
      // } else if ($scope.global.user) {
      //   $scope.currentUser = 'user';
      // } else {
      //   $scope.currentUser = 'guest';
      // }
      if ($scope.guestVotes == undefined) {
        $scope.guestVotes = new Votes();
        for (var i = 0; i < poll.choices.length; i++ ) {
          $scope.guestVotes[poll.choices[i]._id] = false;
        }
        console.log($scope.guestVotes);
      }
    });
    Votes.get({
      pollId: $routeParams.pollId
    }, function(votes) {
      $scope.votes = votes;
      if ($scope.global.user && $scope.global.user._id in votes) {
        $scope.isParticipant = true;
      } else {
        $scope.isParticipant = false;
      }
    });
  };

  // Detect when the user makes a change
  $scope.$watch('votes',
    function(newValue,oldValue) {
      if (newValue != oldValue && oldValue != undefined) {
        // Send an update to the server
        $scope.updateVotes();
      }
    },
  true);

  setInterval($scope.findOne,2000);

}]);
