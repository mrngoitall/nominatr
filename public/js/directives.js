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
    restrict: 'E',
    templateUrl: '/templates/pollHeaderRow.html'
  }
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
          scope.choice.gid = place.id;
          scope.choice.priceLevel = place.price_level;
          // Multiplying the rating by 10 since Mongoose doesn't support double/floats
          scope.choice.grating = place.rating*10;
          scope.choice.gref = place.reference;
          scope.choice.gurl = place.url;
          scope.choice.url = place.website;
          scope.choice.address = place.vicinity;
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
  }
})
.directive('voteRow', function() {
  return {
    restrict: 'A',
    controller: ['$scope', function($scope) {
      $scope.showChoiceLabel = function(choice) {
        return choice.id === 'choice1';
      };
    }],
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