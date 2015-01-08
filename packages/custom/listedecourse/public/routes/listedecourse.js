'use strict';

angular.module('mean.listedecourse').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('listedecourse example page', {
      url: '/listedecourse/example',
      templateUrl: 'listedecourse/views/index.html'
    });
  }
]);
