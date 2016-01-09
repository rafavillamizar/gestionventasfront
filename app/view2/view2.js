'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {
      $scope.cliente = {};

        $scope.prepararNuevoCliente= function () {
            $scope.cliente = {
                nif: "",
                nombre: "",
                apellido1: "",
                apellido2: "",
                email: "",
                direccion: "",
                ciudad: { nombreLocalizacion: "" }
            };
            $scope.abrirDetalleCliente();
        }

        $scope.prepararEdicionCliente = function (cliente) {
            $scope.cliente = cliente;
            $scope.abrirDetalleCliente();
        }

        $scope.prepararEliminarCliente = function (cliente) {
            $scope.cliente = cliente;
            $scope.abrirEliminarCliente();
        }

        $scope.obtenerClientes = function () {
            $http.get('http://192.168.1.136:8080/gestionventas/clientes')
                .success(function (data) {
                    $scope.clientes = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.guardarCliente = function (cliente) {
            $http.post('http://192.168.1.136:8080/gestionventas/clientes', cliente)
                .success(function (data) {
                    $scope.obtenerClientes();
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.eliminarCliente = function(clienteId) {
            $http.delete('http://192.168.1.136:8080/gestionventas/clientes/' + clienteId)
                .success(function(data) {
                    $scope.obtenerClientes();
                })
                .error(function(data) {
                    console.log('Error:' + data);
                });
        };

        $scope.abrirDetalleCliente = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'nuevoClienteModalContent.html',
                controller: 'NuevoClienteModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    cliente: function () {
                        return $scope.cliente;
                    }
                }
            });

            modalInstance.result.then(function (cliente) {
                $scope.guardarCliente(cliente);
            });
        };

        $scope.abrirEliminarCliente = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'eliminarClienteModalContent.html',
                controller: 'EliminarClienteModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    cliente: function () {
                        return $scope.cliente;
                    }
                }
            });

            modalInstance.result.then(function (cliente) {
                $scope.eliminarCliente(cliente.clienteId);
            });
        };

        $scope.obtenerClientes();
}])

    .controller('NuevoClienteModalInstanceCtrl', ['$scope', '$uibModalInstance', '$http', 'cliente', function ($scope, $uibModalInstance, $http, cliente) {
        $scope.cliente = cliente;

        $scope.guardar = function () {
            $uibModalInstance.close($scope.cliente);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.obtenerLocalizacion = function (valor) {
            return $http.get('http://192.168.1.136:8080/gestionventas/ciudades', {
                params: { nombre: valor }
            }).then(function (response) {
                    return response.data.map(function(item) {
                        return item;
                    });
                });
        };

        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;

            $scope.cliente.ciudad = $scope.$item;
        };
    }])

    .controller('EliminarClienteModalInstanceCtrl', ['$scope', '$uibModalInstance', 'cliente', function ($scope, $uibModalInstance, cliente) {
        $scope.cliente = cliente;

        $scope.ok = function () {
            $uibModalInstance.close($scope.cliente);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);