'use strict';

angular.module('mean.listedecourse').controller('ListedecourseController', ['$scope', 'Global', 'Listedecourse',
  function($scope, Global, Listedecourse) {
    $scope.global = Global;
    $scope.package = {
      name: 'listedecourse'
    };
  }
]);
