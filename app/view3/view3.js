'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope', '$http', function($scope, $http) {
      //$scope.formData = {};

      $http.get('http://localhost:8080/gestionventas/productos')
          .success(function(data) {
            $scope.productos = data;
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