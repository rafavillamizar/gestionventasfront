'use strict';

angular.module('myApp.view4', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view4', {
            templateUrl: 'view4/view4.html',
            controller: 'View4Ctrl'
        });
    }])

    .controller('View4Ctrl', ['$scope', '$http', '$uibModal', function ($scope, $http) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;

        $scope.mes = {nombre:"Febrero", valor:2};
        $scope.anio = 2016;

        $scope.meses = [
            {nombre:"Enero", valor:1},
            {nombre:"Febrero", valor:2},
            {nombre:"Marzo", valor:3},
            {nombre:"Abril", valor:4},
            {nombre:"Mayo", valor:5},
            {nombre:"Junio", valor:6},
            {nombre:"Julio", valor:7},
            {nombre:"Agosto", valor:8},
            {nombre:"Septiembre", valor:9},
            {nombre:"Octubre", valor:10},
            {nombre:"Noviembre", valor:11},
            {nombre:"Diciembre", valor:12}
        ]

        $scope.anios = [
            2000,
            2001,
            2002,
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013,
            2014,
            2015,
            2016,
            2017,
            2018,
            2019,
            2020
        ]

        $scope.obtenerInforme = function (valor) {
            return $http.get('http://localhost:8080/gestionventas/informe', {
                params: {numeroPagina: valor, anio: $scope.anio, mes: $scope.mes.valor}
            }).then(function (response) {
                $scope.totalItems = response.data.totalElementos;
                $scope.currentPage = response.data.numeroPagina;
                $scope.informes = response.data.resultado;
            });
        };

        $scope.obtenerInforme($scope.currentPage);

        $scope.cambioPaginador = function() {
            $scope.obtenerInforme($scope.currentPage);
        };
    }]);