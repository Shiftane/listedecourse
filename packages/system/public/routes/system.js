'use strict';

//Setting up route
angular.module('mean.system').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.when('','/listedecourse/home');
    //$urlRouterProvider.when('/listedecourse/home','/listedecourse/home');


    // states for my app
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'system/views/index.html'
      });
  }
]).config(['$locationProvider',
  function($locationProvider) {
    /*$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });*/
    $locationProvider.hashPrefix('!');
  }
]);
