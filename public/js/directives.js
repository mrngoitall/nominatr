angular.module('mean.polls', [])
.directive('pollChoice', function() {
  return {
    restrict: 'E',
    template: '<input type="text" autocompleter ng-model="choice.name" name="{{ choice.id }}" id="{{ choice.id }}" placeholder="Your choice">' +
    '<div class="alert alert-warning" data-ng-show="">' +
        '<strong>Warning!</strong> Best check yo self, you\'re not looking too good.' +
    '</div>',
    link: function(scope, ele, attrs, ctrl) {
    }
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
          input.className = '';
          var place = autocomplete.getPlace();
          //console.log('place',place);
          scope.choice.name = place.name;
          scope.choice.gid = place.id;
          scope.choice.gref = place.reference;
          scope.choice.gurl = place.gurl;
          scope.choice.address = place.formatted_address;
          if (!place.geometry) {
            // Inform the user that the place was not found and return.
            input.className = 'notfound';
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
    template: '<td>{{ votes[invitee.user].name }}</td>' +
              '<td ng-repeat="choice in poll.choices | filter:ignored | orderBy:\'order\'">' +
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
    template: '<span data-ng-show="votes[invitee.user][choice._id]">Yes!</span>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
});