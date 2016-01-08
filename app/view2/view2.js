'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$http', function($scope, $http) {
      //$scope.formData = {};

      $http.get('http://localhost:8080/gestionventas/clientes')
          .success(function(data) {
            $scope.clientes = data;
            console.log(data)
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });

      // Cuando se añade un nuevo TODO, manda el texto a la API
      //$scope.createTodo = function(){
      //  $http.post('http://localhost:8080/gestionventas/ventas', $scope.formData)
      //      .success(function(data) {
      //        $scope.formData = {};
      //        $scope.todos = data;
      //        console.log(data);
      //      })
      //      .error(function(data) {
      //        console.log('Error:' + data);
      //      });
      //};

      // Borra un TODO despues de checkearlo como acabado
      //$scope.deleteTodo = function(id) {
      //  $http.delete('http://localhost:8080/gestionventas/ventas/' + id)
      //      .success(function(data) {
      //        $scope.todos = data;
      //        console.log(data);
      //      })
      //      .error(function(data) {
      //        console.log('Error:' + data);
      //      });
      //};
}]);