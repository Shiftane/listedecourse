'use strict';

angular.module('mean.listedecourse').config(['$stateProvider','$locationProvider',
  function($stateProvider, $location) {
  	$location.html5Mode(html5pushstate);
    $location.hashPrefix('');

    $stateProvider.state('Homepage', {
      url: '/listedecourse/home',
      templateUrl: 'listedecourse/views/index.html'
    });
    
  }
]);
