'use strict';

angular.module('myApp.view3', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])

    .controller('View3Ctrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.producto = {};

        $scope.prepararNuevoProducto = function () {
            $scope.producto = {
                nombre: "",
                precio: "",
                referencia: "",
                caracteristicas: "",
                imagen: "pala.jpg"
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

        $scope.obtenerProductos = function (valor) {
            return $http.get('http://localhost:8080/gestionventas/productos', {
                params: {numeroPagina: valor}
            }).then(function (response) {
                $scope.totalItems = response.data.totalElementos;
                $scope.currentPage = response.data.numeroPagina;
                $scope.productos = response.data.resultado;
            });
        };

        $scope.guardarProducto = function (producto) {
            $http.post('http://localhost:8080/gestionventas/productos', producto)
                .success(function (data) {
                    $scope.obtenerProductos($scope.currentPage);
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.eliminarProducto = function(productoId) {
          $http.delete('http://localhost:8080/gestionventas/productos/' + productoId)
              .success(function(data) {
                  $scope.obtenerProductos($scope.currentPage);
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

        $scope.obtenerProductos($scope.currentPage);

        $scope.cambioPaginador = function() {
            $scope.obtenerProductos($scope.currentPage);
        };
    }])

    .controller('NuevoProductoModalInstanceCtrl', ['$scope', '$uibModalInstance', 'producto', function ($scope, $uibModalInstance, producto) {
        $scope.producto = producto;

        $scope.nombre = producto.nombre;
        $scope.precio = producto.precio;
        $scope.referencia = producto.referencia;
        $scope.caracteristicas = producto.caracteristicas;
        $scope.imagen = producto.imagen;

        $scope.guardar = function () {
            $scope.producto.nombre = $scope.nombre;
            $scope.producto.precio = $scope.precio;
            $scope.producto.referencia = $scope.referencia;
            $scope.producto.caracteristicas = $scope.caracteristicas;
            $scope.producto.imagen = $scope.imagen;

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