'use strict';

angular.module('mean.marmitonsnippet').controller('MarmitonsnippetController', ['$scope', '$log', '$http', 'Global', 'Marmitonsnippet',
    function($scope, $log, $http, Global, Marmitonsnippet) {
        $scope.global = Global;
        $scope.package = {
          name: 'marmitonsnippet'
        };

        
    }
]);