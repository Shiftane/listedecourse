'use strict';

angular.module('mean.listedecourse').config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.state('Homepage', {
      url: '/listedecourse/home',
      templateUrl: 'listedecourse/views/index.html'
    });
    
  }
]);
