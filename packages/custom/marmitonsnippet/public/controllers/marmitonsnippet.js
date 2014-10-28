'use strict';

angular.module('mean.marmitonsnippet').controller('MarmitonsnippetController', ['$scope', 'Global', 'Marmitonsnippet',
  function($scope, Global, Marmitonsnippet) {
    $scope.global = Global;
    $scope.package = {
      name: 'marmitonsnippet'
    };
  }
]);
