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
              // 'invitee user: {{ invitee.user }}' +
              // 'global user: {{ global.user._id }}' +
              '<vote-checkbox></vote-checkbox>' +
              '<vote-checkbox-display></vote-checkbox-display>' +
              '</td>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
})
.directive('voteCheckbox', function() {
  return {
    restrict: 'E',
    template: '<input data-ng-show="global.user._id == invitee.user" type="checkbox" ng-model="votes[invitee.user][choice._id]">',
    link: function(scope, ele, attrs, ctrl) {
      console.log(scope);
      console.log('attrs',attrs);
      if (scope.$eval(attrs.voteCheckbox)) {
        console.log('passed if');
        element.append('<div>This is a test</div>');
        //global.user._id
      }
    }
  };
})
.directive('voteCheckboxDisplay', function() {
  return {
    restrict: 'E',
    template: '<span ng-show="votes[invitee.user][choice._id] && global.user._id != invitee.user">Yes!</span>',
    link: function(scope, ele, attrs, ctrl) {
    }
  };
});