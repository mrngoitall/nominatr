angular.module('mean.polls', [])
.directive('pollChoice', function() {
  return {
    restrict: 'E',
    template: '<input class="form-control" type="text" autocompleter ng-model="choice.name" name="{{ choice.id }}" id="{{ choice.id }}" placeholder="Enter a restaurant name">' +
    '<div class="alert alert-warning" data-ng-show="">' +
        '<strong>Warning!</strong> This resets the votes for this choice.' +
    '</div>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
})
.directive('pollHeaderRow', function() {
  return {
    restrict: 'A',
    templateUrl: '/templates/pollHeaderRow.html',
    controller: ['$scope', function($scope) {
      $scope.hasStarRating = function(choice) {
        return choice.gid && choice.grating && choice.grating > 0;
      };
      $scope.hasPriceRating = function(choice) {
        return choice.gid && choice.priceLevel && choice.priceLevel > 0;
      };
      $scope.hasLink = function(choice) {
        return choice.gid && choice.url.length > 0;
      };
      $scope.hasGLink = function(choice) {
        return choice.gid && choice.gurl.length > 0;
      };
    }],
  };
})
.directive('confirmOnExit', function() {
  return {
    link: function($scope, elem, attrs) {
      window.onbeforeunload = function(){
        if ($scope.createPoll.$dirty) {
          return "Wait! You're not done create a new poll!";
        }
      }
      $scope.$on('$locationChangeStart', function(event, next, current) {
        var pollPage = /#!\/polls\/./;
        if ($scope.createPoll.$dirty && !pollPage.test(next)) {
          if(!confirm("Are you sure you want to leave?")) {
            event.preventDefault();
          }
        }
      });
    }
  };
})
.directive('googleRatings', function() {
  return {
    restrict: 'E',
    template: '<span ng-show="hasStarRating(choice)">{{ choice.grating/10 }} stars</span>' +
      '<span ng-show="hasStarRating(choice) && hasPriceRating(choice)"> / </span>' +
      '<span ng-show="hasPriceRating(choice)">{{ choice.priceLevel/10 | priceRateFormat}}</span>'
  };
})
.directive('autocompleter', function() {
  return {
    restrict: 'A',
    link: function(scope, ele, attrs, ctrl) {
      var input = ele[0];
      if (input) {
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setTypes(['establishment']);
        autocomplete.setBounds(scope.$parent.boundaries);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();
          //console.log('place',place);
          scope.choice.name = place.name;
          scope.choice.gname = place.name;
          scope.choice.gid = place.id;
          scope.choice.priceLevel = place.price_level;
          // Multiplying the rating by 10 since Mongoose doesn't support double/floats
          scope.choice.grating = place.rating*10;
          scope.choice.gref = place.reference;
          scope.choice.gurl = place.url;
          scope.choice.url = place.website;
          scope.choice.address = place.vicinity;
          scope.choice.fullAddress = place.formatted_address;
          if (!place.geometry) {
            // Inform the user that the place was not found and return.
            return;
          }
        });
      }
      var boundchange = scope.$parent.boundchange;
      scope.$watch('boundchange',function(v) {
          autocomplete.setBounds(scope.$parent.boundaries);
        });
    }
  };
})
.directive('voteRow', function() {
  return {
    restrict: 'A',
    template: '<td>{{ votes[invitee.user].name }}</td>' +
              '<td ng-repeat="choice in poll.choices | filter:ignored | orderBy:\'order\'" ng-class="{success:votes[invitee.user][choice._id]}">' +
              '<span>' +
              '<vote-checkbox data-ng-show="global.user._id == invitee.user"></vote-checkbox>' +
              '<vote-checkbox-display data-ng-show="global.user._id != invitee.user"></vote-checkbox-display>' +
              '</td>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
})
.directive('voteCheckbox', function() {
  return {
    restrict: 'E',
    template: '<input type="checkbox" ng-model="votes[invitee.user][choice._id]">',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
})
.directive('voteCheckboxGuest', function() {
  return {
    restrict: 'E',
    template: '<input type="checkbox" ng-model="guestVotes[choice._id]">',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
})
.directive('voteCheckboxDisplay', function() {
  return {
    restrict: 'E',
    template: '<i class="glyphicon glyphicon-ok" data-ng-show="votes[invitee.user][choice._id]"></i>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
});