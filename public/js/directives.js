angular.module('mean.polls', [])
.directive('pollChoice', function() {
  return {
    restrict: 'E',
    template: '<input type="text" ng-model="choice.name" name="{{ choice.id }}" placeholder="Your choice">',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
})
.directive('voteRow', function() {
  return {
    restrict: 'A',
    template: '<td>{{ votes[invitee.user].name }}</td>' +
              '<td ng-repeat="choice in poll.choices | orderBy:\'order\'">' +
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
.directive('voteCheckboxDisplay', function() {
  return {
    restrict: 'E',
    template: '<span data-ng-show="votes[invitee.user][choice._id]">Yes!</span>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
});