'use strict';

angular.module('mean.marmitonsnippet').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('marmiton search', {
      url: '/marmitonsnippet/example',
      templateUrl: 'marmitonsnippet/views/index.html'
    });
  }
]);
