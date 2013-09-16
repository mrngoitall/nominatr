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
//.directive('');