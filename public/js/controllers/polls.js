angular.module('mean.polls').controller('PollsController', ['$scope', '$routeParams', '$location', 'Global', 'Polls', 'Votes', function ($scope, $routeParams, $location, Global, Polls, Votes) {
  $scope.global = Global;

  $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];

  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length+1;

    $scope.choices.push({'id':'choice'+newItemNo});
  };

  if ($scope.global.user && $scope.global.user._id) {
    $scope.currentUser = $scope.global.user._id;
  } else {
    $scope.currentUser = 'guest';
  }
  console.log($scope.currentUser);

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
    });
    Votes.get({
      pollId: $routeParams.pollId
    }, function(votes) {
      $scope.votes = votes;
    });
  };

  // Detect when the user makes a change
  $scope.$watch('votes',
    function(newValue,oldValue) {
      if (newValue != oldValue && oldValue != undefined) {
        console.log('change detected');
        console.log('oldValue',oldValue);
        console.log('newValue',newValue);
        // Send an update to the server
        $scope.updateVotes();
      }
    },true);

}]);
