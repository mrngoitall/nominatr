angular.module('mean.polls').controller('PollsController', ['$scope', '$routeParams', '$location', 'Global', 'Polls', function ($scope, $routeParams, $location, Global, Polls) {
    $scope.global = Global;

    $scope.addNewChoice = function() {
      $scope.choice.push({'something':'blah'});
    };

    $scope.submitPoll = function(poll) {
      console.log(poll);
    };

    $scope.create = function() {
        var poll = new Polls({
            title: this.title,
            content: this.content
        });
        poll.$save(function(response) {
            $location.path("polls/" + response._id);
        });

        this.title = "";
        this.choice = [{},{},{}];
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