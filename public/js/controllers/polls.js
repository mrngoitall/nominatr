angular.module('mean.polls').controller('PollsController', ['$scope', '$routeParams', '$location', 'Global', 'Polls', function ($scope, $routeParams, $location, Global, Polls) {
    $scope.global = Global;

    $scope.choices = [{id: 'choice1'}, {id: 'choice2'}, {id: 'choice3'}];

    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.length+1;

      $scope.choices.push({'id':'choice'+newItemNo});
    };

    $scope.create = function() {
        var poll = new Polls({
            name: this.name,
            choices: this.choices //$('id').attr('value') or $('id').val()
            //[parent.child]
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
        if (!poll.updated) {
            poll.updated = [];
        }
        poll.updated.push(new Date().getTime());

        poll.$update(function() {
            $location.path('polls/' + poll._id);
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
    };
}]);