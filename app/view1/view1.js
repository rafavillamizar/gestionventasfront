'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.venta = {};

        $scope.prepararNuevaVenta = function () {
            $scope.venta = {
                fechaVenta: new Date(),
                cliente: null,
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

        $scope.obtenerVentas = function (valor) {
            $http.get('http://localhost:8080/gestionventas/ventas', {
                params: {numeroPagina: valor}
            }).then(function (response) {
                $scope.totalItems = response.data.totalElementos;
                $scope.currentPage = response.data.numeroPagina;
                $scope.ventas = response.data.resultado;
            });
        };

        $scope.guardarVenta = function (venta) {
            $http.post('http://localhost:8080/gestionventas/ventas', venta)
                .success(function (data) {
                    $scope.obtenerVentas($scope.currentPage);
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        };

        $scope.eliminarVenta = function (ventaId) {
            $http.delete('http://localhost:8080/gestionventas/ventas/' + ventaId)
                .success(function (data) {
                    $scope.obtenerVentas($scope.currentPage);
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

        $scope.obtenerVentas($scope.currentPage);

        $scope.cambioPaginador = function() {
            $scope.obtenerVentas($scope.currentPage);
        };
    }])

    .controller('NuevaVentaModalInstanceCtrl', ['$scope', '$uibModal', '$uibModalInstance', '$http', 'venta', function ($scope, $uibModal, $uibModalInstance, $http, venta) {
        $scope.clienteSeleccionada = false;

        $scope.venta = venta;

        $scope.fechaVenta = venta.fechaVenta;
        $scope.cliente = venta.cliente;
        $scope.detalles = (venta.detalles == null) ? [] : venta.detalles;

        $scope.productoSeleccionado = false;
        $scope.cantidadSeleccionada = false;

        $scope.producto = null;
        $scope.cantidad = null;

        $scope.guardar = function () {
            $scope.venta.fechaVenta = $scope.fechaVenta;
            $scope.venta.cliente = $scope.cliente;
            $scope.venta.detalles = $scope.detalles;

            $uibModalInstance.close($scope.venta);
        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.guardarDetalle = function () {
            $scope.detalleTemporal = {
                producto: $scope.producto,
                cantidad: $scope.cantidad
            };
            $scope.detalles.push($scope.detalleTemporal);
            $scope.producto = null;
            $scope.cantidad = null;

            $scope.productoSeleccionado = false;
            $scope.cantidadSeleccionada = false;

            $scope.calcularTotal();
        };

        $scope.obtenerClientes = function () {
            return $http.get('http://localhost:8080/gestionventas/clientes')
                .then(function (response) {
                $scope.clientes = response.data.resultado;
            });
        };

        $scope.obtenerProductos = function () {
            return $http.get('http://localhost:8080/gestionventas/productos')
                .then(function (response) {
                $scope.productos = response.data.resultado;
            });
        };

        $scope.calcularTotal = function () {
            if(venta != null && venta.detalles != null && venta.detalles.length > 0) {
                var index = 0;
                $scope.totalPrecio = 0;
                for (index; index < venta.detalles.length; ++index) {
                    $scope.totalPrecio += (venta.detalles[index].producto.precio * venta.detalles[index].cantidad);
                }
            }
        };

        $scope.onSelectCliente = function () {
            if($scope.cliente != null)
                $scope.clienteSeleccionada = true;
        };

        $scope.onSelectProducto = function () {
            if($scope.producto != null)
                $scope.productoSeleccionado = true;
        };

        $scope.onSelectCantidad = function () {
            if($scope.cantidad != null)
                $scope.cantidadSeleccionada = true;
        };

        $scope.obtenerClientes();
        $scope.obtenerProductos();
        $scope.calcularTotal();

        if($scope.cliente != null)
            $scope.clienteSeleccionada = true;

        $scope.prepararEliminarDetalleVenta = function (detalleVenta) {
            $scope.detalleTemporal = detalleVenta;
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
                        return $scope.detalleTemporal;
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
            $scope.fechaVenta = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.fechaVenta = null;
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
            $scope.fechaVenta = new Date(year, month, day);
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