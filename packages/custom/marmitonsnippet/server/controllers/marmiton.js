'use strict';

/**
 * Module dependencies.
 */
var 
  //mongoose = require('mongoose'),
  //Recipe = mongoose.model('recipe'),
  cheerio = require('cheerio'),
  request = require('request');
  //config = require('meanio').loadConfig();


//var searchTerm = 'agneau';

var url = 'http://www.marmiton.org/recettes/recherche.aspx?s=';

//var recetteUrl = 'http://www.marmiton.org/recettes/recette_tajine-d-agneau-aux-pruneaux_13086.aspx';
var resultsPath = 'div.m_item.recette_classique';
var recettePath = 'div.m_bloc_cadre';
var unities = ['cuillère à café', ' kg ',' g ','cuillères à soupe', ' dosette ', ' gousses ', ' gousse ', ' quelque ', ' quelques ', ' paquet ', ' cl ', ' pincée '];

/**
 * Get detail Recette with cheerio
 */
exports.getRecette = function(req, res) {  
  var recetteUrl = req.params.url;
  console.log('Try to reach : ' + recetteUrl);
  
  var options = {
    url: recetteUrl,
    headers: {
        'User-Agent': 'Mozilla/5.0'
      }
  };
  request(options, function(err, resp, body){
    //TODO : ADD ERROR HANDLER - Disconnect the wifi
    console.log('Request done : TRY TO PARSE IT');
    var $ = cheerio.load(body);
    console.log('BODY PARSED BY CHEERIO : ' + body);
    var recette = $(recettePath); //use your CSS selector here
    console.log('Links : ' + recette);
    var newRecipe = {};
    newRecipe.title = $('h1.m_title span.fn',recette).text().trim();
    newRecipe.prepTime = $('span.preptime', recette).text().trim();
    newRecipe.cookingTime = $('span.cooktime', recette).text().trim();
    var ingredientsStr = $('p.m_content_recette_ingredients', recette).text().split('-');
    console.log('ingredients : ' + ingredientsStr);
    var ingredients = [];
    ingredientsStr.forEach(function(ingredientStr, i){
      var ingredient = {};
      var nbrUnityFound = 0;
      unities.forEach(function(unity, i){
        
        console.log('Ingredient to Parse : ' + ingredientStr + ' --- index' + i);
        var resultIndex = ingredientStr.indexOf(unity);
        if(resultIndex > -1){
          ingredient.unity = ingredientStr.substring(resultIndex, resultIndex + unity.length).trim();
          if(resultIndex !== 0){
            ingredient.quantity = ingredientStr.substring(0, resultIndex).trim();
          }
          ingredient.product = ingredientStr.substring(resultIndex + unity.length, ingredientStr.length).trim();
          nbrUnityFound = nbrUnityFound+1;
        }
        if(nbrUnityFound === 0){
          console.log('Aucune unité pour cet ingrédient : ' + ingredientStr + ' | ' + unities);
          ingredient.product = ingredientStr.trim();
        }else if(nbrUnityFound === 1){
          console.log('Ingredient found : ' + ingredientStr + ' | ' + unities);
        }else{
          console.log('Plusieurs unités pour cet ingrédient : ' + ingredientStr + ' | ' + unities);
        }
        //switch(resultIndex)
      });

      console.log('ingredient : ' + JSON.stringify(ingredient));
      ingredients.push(ingredient);
    });
    
    var contenu = {
        nbrPersons : $('p.m_content_recette_ingredients > span', recette).text().substring(17,19).trim(),
        ingredients : ingredients
    };
    newRecipe.contenu = contenu;

    
    var response = {
        origin : 'Marmiton',
        message: 'Parsing finished',
        result: newRecipe,
        status: 'success'
    };
    res.json(response);
  });
  
};

/**
 * Search in Marmiton with cheerio
 */
exports.searchMarmiton = function(req, res) {
  var searchTerm = req.params.q;
  var urlMarmiton = url + searchTerm + '&type=all';
  console.log('Try to reach : ' + urlMarmiton);
  
  var options = {
    url: urlMarmiton,
    headers: {
        'User-Agent': 'Mozilla/5.0'
      }
  };
  request(options, function(err, resp, body){
    //TODO : ADD ERROR HANDLER - Disconnect the wifi
    var result = [];
    console.log('Request done : TRY TO PARSE IT');
    var $ = cheerio.load(body);
    //console.log('BODY PARSED BY CHEERIO : ' + body);
    var results = $(resultsPath); //use your CSS selector here
    console.log('Results Nbr with '+resultsPath+' : ' + results);
    
    $(results).each(function(i, link){
      var newRecipe = {};
      newRecipe.title = $('div.m_titre_resultat',link).text().trim();
      newRecipe.link = $('a', link).attr('href');
      newRecipe.prepTime = $('div.m_prep_time', link).parent().text().trim();
      newRecipe.cookingTime = $('div.m_cooking_time', link).parent().text().trim();
      newRecipe.details = $('div.m_detail_recette', link).text().trim();
      newRecipe.text = $('div.m_texte_resultat', link).text().trim();
      result.push(newRecipe);
    });
    var response = {
        origin : 'Marmiton',
        baseUrl : 'http://www.marmiton.org',
        message: 'Parsing finished',
        result: result,
        status: 'success'
    };
    res.json(response);
  });
  
};
