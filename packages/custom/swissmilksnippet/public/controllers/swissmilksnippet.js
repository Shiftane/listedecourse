'use strict';

angular.module('mean.swissmilksnippet').controller('SwissmilksnippetController', ['$scope', '$log', '$http', 'Global', 'Swissmilksnippet',
    function($scope, $log, $http, Global, Swissmilksnippet) {
        $scope.global = Global;
        $scope.package = {
          name: 'Swissmilksnippet'
        };

        
    }
]);