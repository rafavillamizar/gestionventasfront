'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.clientes = {};

        $scope.prepararNuevoCliente= function () {
            $scope.cliente = {
                nif: "",
                nombre: "",
                apellido1: "",
                apellido2: "",
                email: "",
                direccion: "",
                ciudad: null
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

        $scope.obtenerClientes = function (valor) {
            return $http.get('http://localhost:8080/gestionventas/clientes', {
                params: {numeroPagina: valor}
            }).then(function (response) {
                $scope.totalItems = response.data.totalElementos;
                $scope.currentPage = response.data.numeroPagina;
                $scope.clientes = response.data.resultado;
            });
        };

        $scope.guardarCliente = function (cliente) {
            $http.post('http://localhost:8080/gestionventas/clientes', cliente)
                .success(function (data) {
                    $scope.obtenerClientes($scope.currentPage);
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.eliminarCliente = function(clienteId) {
            $http.delete('http://localhost:8080/gestionventas/clientes/' + clienteId)
                .success(function(data) {
                    $scope.obtenerClientes($scope.currentPage);
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

        $scope.obtenerClientes($scope.currentPage);

        $scope.cambioPaginador = function() {
            $scope.obtenerClientes($scope.currentPage);
        };
}])

    .controller('NuevoClienteModalInstanceCtrl', ['$scope', '$uibModalInstance', '$http', 'cliente', function ($scope, $uibModalInstance, $http, cliente) {
        $scope.ciudadSeleccionada = false;

        $scope.cliente = cliente;

        $scope.nif = cliente.nif;
        $scope.nombre = cliente.nombre;
        $scope.apellido1 = cliente.apellido1;
        $scope.apellido2 = cliente.apellido2;
        $scope.email = cliente.email;
        $scope.direccion = cliente.direccion;
        $scope.ciudad = cliente.ciudad;

        $scope.guardar = function () {
            $scope.cliente.nif = $scope.nif;
            $scope.cliente.nombre = $scope.nombre;
            $scope.cliente.apellido1 = $scope.apellido1;
            $scope.cliente.apellido2 = $scope.apellido2;
            $scope.cliente.email = $scope.email;
            $scope.cliente.direccion = $scope.direccion;
            $scope.cliente.ciudad = $scope.ciudad;

            $uibModalInstance.close($scope.cliente);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.obtenerLocalizacion = function () {
            return $http.get('http://localhost:8080/gestionventas/ciudades')
                .then(function (response) {
                    $scope.ciudades = response.data;
                });
        };

        $scope.onSelect = function () {
            if($scope.ciudad != null)
                $scope.ciudadSeleccionada = true;
        };

        $scope.obtenerLocalizacion();

        if($scope.ciudad != null)
            $scope.ciudadSeleccionada = true;
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