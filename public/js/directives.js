angular.module('mean.polls', [])
.directive('pollChoice', function() {
  return {
    restrict: 'E',
    template: '<input type="text" ng-model="choice.message" name="{{ choice.id }}" placeholder="Your choice">',
    link: function(scope, ele, attrs, ctrl) {
      // scope.$watch(attrs.ngModel,
      //   function(v) {
      //     scope.ngModel = v.poll;
      //   });
    }
  };
})
.directive('voteRow', function() {
  return {
    restrict: 'A',
    template: '<td>{{ votes[invitee.user].name }}</td>' +
              '<td ng-repeat="choice in poll.choices | orderBy:\'order\'">' +
              '<input type="checkbox" ng-model="votes[invitee.user][choice._id]">' +
              '</td>',
    link: function(scope, ele, attrs, ctrl) {
      //scope.$apply(scope.findVotes());

    }
  };
});

/*
  
    
  
*/