angular.module('mean.directives', [])
.directive('pollChoice', function() {
  return {
    template: '<input type="text" id="{{choice.id}}" ng-model="choice" placeholder="Your choice">',
    link: function(scope, ele, attrs, ctrl) {
      scope.$watch(attrs.ngModel,
        function(v) {
          scope.ngModel = v.data;
        });
    }
  };
});