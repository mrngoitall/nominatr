angular.module('mean.polls').controller('PollsController', ['$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'Global', 'Polls', 'Votes', function ($rootScope, $scope, $routeParams, $location, $timeout, Global, Polls, Votes) {
  $scope.global = Global;

  $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];
  $scope.boundchange = 0;

  var input = /** @type {HTMLInputElement} */(document.getElementById('location'));
  // Setting a default boundary for now, until we can propagate location changes to the autocompleter directive. 
  $scope.boundaries = new google.maps.LatLngBounds(
    new google.maps.LatLng(37.70339999999999,-122.527), 
    new google.maps.LatLng(37.812,-122.3482));
  if (input) {
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setTypes(['geocode']);
    autocomplete.setBounds($scope.boundaries);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      //console.log(place);
      if (place.geometry.viewport) {
        $scope.boundaries = new google.maps.LatLngBounds(
          new google.maps.LatLng(place.geometry.viewport.ea.b,place.geometry.viewport.ia.b),
          new google.maps.LatLng(place.geometry.viewport.ea.d,place.geometry.viewport.ia.d));
      } else {
        $scope.boundaries = new google.maps.LatLngBounds(
          new google.maps.LatLng(place.geometry.location.nb-0.003,place.geometry.location.ob-0.003),
          new google.maps.LatLng(place.geometry.location.nb+0.003,place.geometry.location.ob+0.003));
      }
      $scope.boundchange++;
      $scope.location = place.formatted_address;
      if (!place.geometry) {
        // Inform the user that the place was not found and return.
        return;
      }
    });
  }

  $scope.today = function() {
    $scope.eventDate = new Date();
  // Initialize time with the nearest upcoming 15 minute interval
    var nextMinute = Math.ceil($scope.eventDate.getMinutes()/15)*15;
    if (nextMinute === 60) {
      nextMinute = 0;
      $scope.eventDate.setHours($scope.eventDate.getHours()+1);
    }
    $scope.eventDate.setMinutes(nextMinute);
  };
  $scope.today();
  $scope.minDate = $scope.eventDate;
  $scope.eventTime = $scope.eventDate;

  // Clears date field
  $scope.clearDate = function () {
    $scope.eventDate = null;
  };

  $scope.openDate = function() {
    $timeout(function() {
      $scope.dateOpened = true;
    });
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 0
  };

  // Toggles whether to continuously poll the server for updates
  $rootScope.shouldRefresh = false;

  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length+1;
    $scope.choices.push({'id':'choice'+newItemNo});
  };

  $scope.addNewChoiceToExisting = function() {
    var newItemNo = $scope.poll.choices.length+1;
    $scope.poll.choices.push({'id':'choice'+newItemNo});
  };

  $scope.ignored = function(choice) {
    return !choice.ignore;
  };

  $scope.showLabel = function(choice) {
    return choice.id === 'choice1';
  };

  $scope.create = function() {
    $scope.eventDate.setHours($scope.eventTime.getHours());
    $scope.eventDate.setMinutes($scope.eventTime.getMinutes());
    var poll = new Polls({
      name: this.name,
      choices: this.choices,
      eventDate: this.eventDate
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
      if ($scope.guestVotes == undefined) {
        $scope.guestVotes = new Votes();
        for (var i = 0; i < poll.choices.length; i++ ) {
          $scope.guestVotes[poll.choices[i]._id] = false;
        }
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
      $scope.tallyVotes();
    });
    $timeout.cancel($scope.timeout);
    if ($rootScope.shouldRefresh) {
      $scope.timeout = $timeout(function() {
        $scope.findOne();
      }, 2000);
    }
  };

  $scope.findOneAndRefresh = function() {
    $rootScope.shouldRefresh = true;
    $scope.findOne();
  };

  $scope.findOneAndStopRefresh = function() {
    $rootScope.shouldRefresh = false;
    $scope.findOne();
  };

  // Create a new tally object to make it easier for Angular to consume
  $scope.tallyVotes = function() {
    var talliedVotes = {};
    for (var user in $scope.votes) {
      // On the first user, initialize the choices
      if (!Object.keys(talliedVotes).length) {
        for (var choice in $scope.votes[user]) {
          talliedVotes[choice] = 0;
        }
      }
      for (var choice in $scope.votes[user]) {
        if ($scope.votes[user][choice]) {
          talliedVotes[choice]++;
        }
      }
    }
    $scope.talliedVotes = talliedVotes;
  };

  // Detect when the user makes a change
  $scope.$watch('votes',
    function(newValue,oldValue) {
      if (newValue != undefined && oldValue != undefined) {
        // Comparing stringified versions of the object so we can make a comparison based on values
        if (JSON.stringify(newValue[$scope.global.user._id]) != JSON.stringify(oldValue[$scope.global.user._id])) {
          // Send an update to the server
          $scope.updateVotes();
          $scope.tallyVotes();
        }
      }
    },
  true);

}]);
