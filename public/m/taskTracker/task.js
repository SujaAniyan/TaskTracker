angular.module('tasks', ['ngRoute','ngMaterial','angular-growl', 'ngFileUpload', 'ngAnimate','ngSanitize'])

.run(function ($rootScope, $location, $http) {
	$http.get('/token')
		.success(function (user, status) {
		if (user) {
			$rootScope.user = user;
		}
    else {
			// user not found, ask to login
    }
	});
})

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  
  .when('/tasks', {
      templateUrl:'/public/m/taskTracker/tasks.html',
      controller: 'tasksCtrl'
  })

  .when('/tasks/:id/edit', {
      templateUrl: '/public/m/taskTracker/edittasks.html',
      controller: 'tasksCtrl'
  });
  
  
  // if none of the above states are matched, use this as the fallback
  $routeProvider.otherwise('/tasks');

}]);