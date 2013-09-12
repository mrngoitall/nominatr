//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/polls', {
            templateUrl: 'views/polls/list.html'
        }).
        when('/polls/create', {
            templateUrl: 'views/polls/create.html'
        }).
        when('/polls/:pollId/edit', {
            templateUrl: 'views/polls/edit.html'
        }).
        when('/polls/:pollId', {
            templateUrl: 'views/polls/view.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);