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
                $scope.newNbrPersons = parseInt($scope.recipe.result.contenu.nbrPersons);
                $scope.oldNbrPersons = parseInt($scope.recipe.result.contenu.nbrPersons);
                $log.info('newNbrPersons : ' + $scope.recipe.result.contenu.nbrPersons);
    		  }).
    		  error(function(data, status, headers, config) {
    		    
    		 });
        };
        $scope.updateQuantities = function(newNbrPersons){
        	var nbrPersons = $scope.oldNbrPersons;
        	$log.info('NbrPersons : ' + nbrPersons + ' New : ' + this.newNbrPersons);
        	var inputNbrPersons = $scope.newNbrPersons;
        	$scope.recipe.result.contenu.ingredients.forEach(function(element, index){
        		var quantity = element.quantity / nbrPersons * inputNbrPersons;
        		$log.info('new Final quantity for ' + element.product + ' = ' + quantity);
        		element.quantity = quantity;
        	});
        	$scope.oldNbrPersons = inputNbrPersons;
        };
        $scope.saveRecetteInListeDeCourse = function(){
        	if($scope.listedecourse){
                $scope.recipe.result.contenu.nbrPersons = $scope.newNbrPersons;
        		$scope.listedecourse.recettes.push($scope.recipe.result);
        		$log.info('Je vais mettre à jour cette liste d\'ingrédients : ' + $scope.listedecourse._id );
        		$http.put('/listedecourses/'+$scope.listedecourse._id, $scope.listedecourse).
    			  success(function(data, status, headers, config) {
    			  	$log.info('SUPER CA MARCHE = ' + JSON.stringify(data));
    			  	$scope.listedecourse = data;
    			  }).
    			  error(function(data, status, headers, config) {
    			    $log.info('THATS SUCKS !!! = ' + JSON.stringify(data));
    			 });
        	}else{
        		var listedecourse = {};
        		listedecourse.name = 'Default';
        		listedecourse.recettes = [];
        		listedecourse.recettes.push($scope.recipe.result);
        		$log.info('Je vais sauver cette liste d\'ingrédients');
    	    	$http.post('/listedecourses', listedecourse).
    			  success(function(data, status, headers, config) {
    			  	$log.info('SUPER CA MARCHE = ' + JSON.stringify(data));
    			  	$scope.listedecourse = data;
    			  }).
    			  error(function(data, status, headers, config) {
    			    $log.info('THATS SUCKS !!! = ' + JSON.stringify(data));
    			 });
    		}
        };
    	$scope.show = function(index){
            $log.info('Show me this recipe : ' + index);
            $scope.recetteToShow = $scope.listedecourse.recettes[index];  
            $scope.allIngredients = false;      
    	};
    }
]);