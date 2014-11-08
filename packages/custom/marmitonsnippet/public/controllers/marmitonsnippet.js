'use strict';

angular.module('mean.marmitonsnippet').controller('MarmitonsnippetController', ['$scope', '$log', '$http', 'Global', 'Marmitonsnippet',
  function($scope, $log, $http, Global, Marmitonsnippet) {
    $scope.global = Global;
    $scope.package = {
      name: 'marmitonsnippet'
    };
    $scope.results = [];
    $scope.search = function(){

    	$log.info('Search for query : ' + this.query);
    	$http.get('/marmitonsnippet/search/' + this.query).
		  success(function(data, status, headers, config) {
		  	$scope.results = data;
		  	$log.info($scope.results);
		  }).
		  error(function(data, status, headers, config) {
		    
		 });
    };
    $scope.getRecipe = function(recipeUrl){
    	$log.info('Get Recipe : ' + recipeUrl);
    	$http.get('/marmitonsnippet/recette/' + encodeURIComponent(recipeUrl)).
		  success(function(data, status, headers, config) {
		  	$scope.recipe = data;
		  	$log.info($scope.recipe);
		  }).
		  error(function(data, status, headers, config) {
		    
		 });
    };
  }
]);
