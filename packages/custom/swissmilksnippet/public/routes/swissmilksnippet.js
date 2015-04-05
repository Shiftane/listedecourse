'use strict';

angular.module('mean.swissmilksnippet').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('swissmilk search', {
      url: '/swissmilksnippet/example',
      templateUrl: 'swissmilksnippet/views/index.html'
    });
  }
]);
