angular.module('tasks')

.factory('dataFactory', ["$http", function ($http) {
    var factory = {};
    factory.data = [];
    function init() {
        /*for (var i=0; i<92; i++) {
            factory.data.push("Customer "+i);
        }*/
        return $http({
            method: 'GET',
            url: '/api/v1/secure/tasks',
            }).then(function (response) {
                //console.log('m in factory' +JSON.stringify(response));
                for (var i=0; i<response.data.length; i++) {
                    factory.data.push(response.data[i]);
                }
             });
    }
    init();
    return factory;
}])

.controller('tasksCtrl', ['$scope', '$routeParams', '$http', '$rootScope', '$filter', 'dataFactory', '$location', function($scope, $routeParams, $http, $rootScope, $filter, dataFactory, $location){
    var id = $routeParams.id;
    var refresh = function() {
        $scope.taskList = $http.get('/api/v1/secure/tasks/'+id).success(function(response){
          $scope.taskList = response;          
          console.log('valid date '+$scope.taskList.dueDate );
          $scope.taskList.dueDate = $filter('date')($scope.taskList.dueDate, "MM/dd/yyyy");
          //$scope.dueDate  = moment($scope.taskList.validTill).format('YYYY-MM-DD');
        });
    }; // refresh method ends

      refresh();
	
   /*pagination start for tasks */

    $scope.currentPage = 0;
    $scope.pageSize = 4;
    $scope.totalPages = 0;
    $scope.pagedData = [];
    
    $scope.CurrentDate = new Date();

    $scope.pageButtonDisabled = function(dir) {
        if (dir == -1) {
            return $scope.currentPage == 0;
        }
        return $scope.currentPage >= dataFactory.data.length/$scope.pageSize - 1;
    }

    $scope.paginate = function(nextPrevMultiplier) {
        $scope.currentPage += (nextPrevMultiplier * 1);
        $scope.pagedData = dataFactory.data.slice($scope.currentPage*$scope.pageSize);
    }

    function init() {
        $http.get('/api/v1/secure/tasks',{
            cache: true
        }).success(function(response) {
            console.log(response);
            $scope.taskList = response;
            $scope.totalPages = Math.ceil($scope.taskList.length/$scope.pageSize);
         });

        $scope.pagedData = dataFactory.data;
    }

    init();
   /* pagination ends */

   $scope.updateTask = function() {
    $http.put('/api/v1/secure/tasks/' + $scope.taskList._id, $scope.taskList).success(function(response) {     
      console.log('update Task');
      $location.path("/tasks");
      refresh();
    })
    .error(function(data, status){});
  }; // update method ends


   $scope.cancelTask = function() {
        $scope.taskList="";
        $location.path("/tasks");
    };//cancel method ends   
    
 }])

.directive('uiDate', function() {
  return {
    require: '?ngModel',
    link: function($scope, element, attrs, controller) {
      var originalRender, updateModel, usersOnSelectHandler;
      if ($scope.uiDate == null) $scope.uiDate = {};
      if (controller != null) {
        updateModel = function(value, picker) {
          return $scope.$apply(function() {
            return controller.$setViewValue(element.datepicker("getDate"));
          });
        };
        if ($scope.uiDate.onSelect != null) {
          usersOnSelectHandler = $scope.uiDate.onSelect;
          $scope.uiDate.onSelect = function(value, picker) {
            updateModel(value);
            return usersOnSelectHandler(value, picker);
          };
        } else {
          $scope.uiDate.onSelect = updateModel;
        }

        originalRender = controller.$render;
        controller.$render = function() {
          originalRender();
          return element.datepicker("setDate", controller.$viewValue);
        };
      }
      return element.datepicker($scope.uiDate);
    }
  };
})
