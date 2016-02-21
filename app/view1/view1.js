'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.venta = {};

        $scope.prepararNuevaVenta = function () {
            $scope.venta = {
                fechaVenta: new Date(),
                cliente: {nif: ""},
                detalles: []
            };
            $scope.abrirDetalleVenta();
        }

        $scope.prepararEdicionVenta = function (venta) {
            $scope.venta = venta;
            $scope.abrirDetalleVenta();
        }

        $scope.prepararEliminarVenta = function (venta) {
            $scope.venta = venta;
            $scope.abrirEliminarVenta();
        }

        $scope.obtenerVentas = function () {
            $http.get('http://localhost:8080/gestionventas/ventas')
                .success(function (data) {
                    $scope.ventas = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };

        $scope.guardarVenta = function (venta) {
            $http.post('http://localhost:8080/gestionventas/ventas', venta)
                .success(function (data) {
                    $scope.obtenerVentas();
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.eliminarVenta = function (ventaId) {
            $http.delete('http://localhost:8080/gestionventas/ventas/' + ventaId)
                .success(function (data) {
                    $scope.obtenerVentas();
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.abrirDetalleVenta = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'nuevaVentaModalContent.html',
                controller: 'NuevaVentaModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    venta: function () {
                        return $scope.venta;
                    }
                }
            });

            modalInstance.result.then(function (venta) {
                $scope.guardarVenta(venta);
            });
        };

        $scope.abrirEliminarVenta = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'eliminarVentaModalContent.html',
                controller: 'EliminarVentaModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    venta: function () {
                        return $scope.venta;
                    }
                }
            });

            modalInstance.result.then(function (venta) {
                $scope.eliminarVenta(venta.ventaId);
            });
        };

        $scope.obtenerVentas();
    }])

    .controller('NuevaVentaModalInstanceCtrl', ['$scope', '$uibModal', '$uibModalInstance', '$http', 'venta', function ($scope, $uibModal, $uibModalInstance, $http, venta) {
        $scope.venta = venta;
        $scope.detalleTemporal = {
            producto: {
                referencia: ""
            },
            cantidad: ""
        };

        $scope.guardar = function () {
            $scope.venta.fechaVenta = $scope.dt.getTime();
            $uibModalInstance.close($scope.venta);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.guardarDetalle = function () {
            $scope.venta.detalles.push($scope.detalleTemporal);
            $scope.detalleTemporal = {
                producto: {
                    referencia: ""
                },
                cantidad: ""
            };
        };

        $scope.obtenerClientes = function (valor) {
            return $http.get('http://192.168.1.136:8080/gestionventas/clientes', {
                params: {nif: valor}
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };

        $scope.obtenerProductos = function (valor) {
            return $http.get('http://192.168.1.136:8080/gestionventas/productos', {
                params: {referencia: valor}
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };

        $scope.onSelectCliente = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;

            $scope.venta.cliente = $scope.$item;
        };

        $scope.onSelectProducto = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;

            $scope.detalleTemporal.producto = $scope.$item;
        };

        $scope.prepararEliminarDetalleVenta = function (detalleVenta) {
            $scope.detalleVenta = detalleVenta;
            $scope.abrirEliminarDetalleVenta();
        }

        $scope.abrirEliminarDetalleVenta = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'eliminarDetalleModalContent.html',
                controller: 'EliminarDetalleModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    detalleVenta: function () {
                        return $scope.detalleVenta;
                    }
                }
            });

            modalInstance.result.then(function (detalleVenta) {
                var dt = $scope.venta.detalles.indexOf(detalleVenta);
                $scope.venta.detalles.splice(dt, 1);
            });
        };

        //Componente datePicker
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return false;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
    }])

    .controller('EliminarVentaModalInstanceCtrl', ['$scope', '$uibModalInstance', 'venta', function ($scope, $uibModalInstance, venta) {
        $scope.venta = venta;

        $scope.ok = function () {
            $uibModalInstance.close($scope.venta);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }])

    .controller('EliminarDetalleModalInstanceCtrl', ['$scope', '$uibModalInstance', 'detalleVenta', function ($scope, $uibModalInstance, detalleVenta) {
        $scope.detalleVenta = detalleVenta;

        $scope.ok = function () {
            $uibModalInstance.close($scope.detalleVenta);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);