'use strict';

angular.module('myApp.view3', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])

    .controller('View3Ctrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.producto = {};

        $scope.prepararNuevoProducto = function () {
            $scope.producto = {
                nombre: "",
                precio: ""
            };
            $scope.abrirDetalleProducto();
        }

        $scope.prepararEdicionProducto = function (producto) {
            $scope.producto = producto;
            $scope.abrirDetalleProducto();
        }

        $scope.prepararEliminarProducto = function (producto) {
            $scope.producto = producto;
            $scope.abrirEliminarProducto();
        }

        $scope.obtenerProductos = function () {
            $http.get('http://192.168.1.136:8080/gestionventas/productos')
                .success(function (data) {
                    $scope.productos = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.guardarProducto = function (producto) {
            $http.post('http://192.168.1.136:8080/gestionventas/productos', producto)
                .success(function (data) {
                    $scope.obtenerProductos();
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.eliminarProducto = function(productoId) {
          $http.delete('http://192.168.1.136:8080/gestionventas/productos/' + productoId)
              .success(function(data) {
                  $scope.obtenerProductos();
              })
              .error(function(data) {
                console.log('Error:' + data);
              });
        };

        $scope.abrirDetalleProducto = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'nuevoProductoModalContent.html',
                controller: 'NuevoProductoModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    producto: function () {
                        return $scope.producto;
                    }
                }
            });

            modalInstance.result.then(function (producto) {
                $scope.guardarProducto(producto);
            });
        };

        $scope.abrirEliminarProducto = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'eliminarProductoModalContent.html',
                controller: 'EliminarProductoModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    producto: function () {
                        return $scope.producto;
                    }
                }
            });

            modalInstance.result.then(function (producto) {
                $scope.eliminarProducto(producto.productoId);
            });
        };

        $scope.obtenerProductos();
    }])

    .controller('NuevoProductoModalInstanceCtrl', ['$scope', '$uibModalInstance', 'producto', function ($scope, $uibModalInstance, producto) {
        $scope.producto = producto;

        $scope.guardar = function () {
            $uibModalInstance.close($scope.producto);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])

    .controller('EliminarProductoModalInstanceCtrl', ['$scope', '$uibModalInstance', 'producto', function ($scope, $uibModalInstance, producto) {
        $scope.producto = producto;

        $scope.ok = function () {
            $uibModalInstance.close($scope.producto);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);