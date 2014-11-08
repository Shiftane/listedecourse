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



var url = 'http://www.marmiton.org/recettes/recherche.aspx?s=';


// PARSING PLACEHOLDER
var resultsPath = 'div.m_item.recette_classique';
var recettePath = 'div.m_bloc_cadre';
var unities = ['cuillère à café', ' kg ',' g ', ' louche ', ' louches ', ' cube ', 'feuilles', 'ml', 'pot', ' petit pot ', 'litre', 'cuillère à soupe', 'cuillères à soupe', ' dosette ', ' gousses ', ' gousse ', ' quelque ', ' quelques ', ' paquet ', ' cl ', ' pincée '];
var separator = ['de', 'd\'', 'du'];
var titlePlaceHolder = 'h1.m_title span.fn';

var evalQuantity = function(quantityStr){
  /*
   *   Try to find a division quantity
   */
  var slashIndex = quantityStr.indexOf('/');
  if (slashIndex > -1){
    var returnIngredient = {};
    var dividende = parseInt(quantityStr.substring(0,slashIndex));
    var diviseur = parseInt(quantityStr.substring(slashIndex+1, quantityStr.length));
    returnIngredient.quantity = parseFloat(eval(String(dividende + '/' + diviseur)));
    returnIngredient.product = quantityStr.replace(String(dividende + '/' + diviseur), '').trim();
    console.log('EVAL OK : ' + JSON.stringify(returnIngredient));
    return returnIngredient;
  }else if(isNaN(parseInt(quantityStr))){
    console.log('Etrange ingredient : ' + quantityStr);
  }else{
    console.log('Etrange ingredient : ' + quantityStr);
  }
  return;
};

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
    console.log('Request done : TRY TO PARSE IT  URL= ' + recetteUrl);
    var $ = cheerio.load(body);
    //console.log('BODY PARSED BY CHEERIO : ' + body);
    var recette = $(recettePath); //use your CSS selector here
    var newRecipe = {};
    newRecipe.title = $(titlePlaceHolder,recette).text().trim();
    newRecipe.prepTime = $('span.preptime', recette).text().trim();
    newRecipe.cookingTime = $('span.cooktime', recette).text().trim();
    newRecipe.description = $('div.m_content_recette_todo').text().trim();
    var nbrPersons = $('p.m_content_recette_ingredients > span', recette).text().substring(17,19).trim();
    $('p.m_content_recette_ingredients span', recette).remove();
    var ingredientsStr = $('p.m_content_recette_ingredients', recette).text().trim().split('-');
    var ingredients = [];
    console.log('Recipe : ' + JSON.stringify(newRecipe));

    ingredientsStr.forEach(function(ingredientStr, i){
      if(ingredientStr === ''){
        return;
      }
      var ingredient = {};
      var nbrUnityFound = 0;

      console.log('1) Parsing with unities : ' + ingredientStr.trim());
      /*
       * FIRST : Try to split with unity table
       */
      unities.forEach(function(unity, i){
        
        var resultIndex = ingredientStr.indexOf(unity);
        if(resultIndex > -1){
          // IF UNITY EXIST
          ingredient.unity = ingredientStr.substring(resultIndex, resultIndex + unity.length).trim();
          if(resultIndex !== 0){
            try{
              ingredient.quantity = eval(ingredientStr.substring(0, resultIndex).trim());
            }catch(e){
              console.log(e);
            }
            
          }
          ingredient.product = ingredientStr.substring(resultIndex + unity.length, ingredientStr.length).trim();
          separator.forEach(function(element, index){
            var pos = ingredient.product.indexOf(element);
            if(pos === 0){
              ingredient.product = ingredient.product.substring(element.length, ingredient.product.length);
            }
          });
          nbrUnityFound = nbrUnityFound+1;
        }
        
      });

      if(nbrUnityFound === 0){
        console.log('2) Parsing with evaluation of quantity  : ' + ingredientStr.trim());
        var result = evalQuantity(ingredientStr);
        if (result){
          ingredient = result;
          ingredient.unity = 'pcs';
          console.log('Parsing SUCCESS : ' + JSON.stringify(ingredient));
        }else{
          console.log('3) Parsing with of parseInt  : ' + ingredientStr.trim());
          var quantity = parseInt(ingredientStr);
          if(!isNaN(quantity)){
            ingredient.product = ingredientStr.trim().replace(quantity, '').trim();
            ingredient.unity = 'pcs';
            ingredient.quantity = quantity;
          }else{
            console.log('?) Etrange ingredient  : ' + ingredientStr.trim());
            ingredient.product = ingredientStr.trim();
          }
        }
      }else if(nbrUnityFound === 1){
        console.log('Parsing SUCCESS : ' + ingredientStr + ' ==> ' + JSON.stringify(ingredient));
      }else{
        console.log('Plusieurs unités pour cet ingrédient : ' + ingredientStr + ' | ' + unities);
      }
      

      console.log('ingredient : ' + JSON.stringify(ingredient));
      ingredients.push(ingredient);
      
    });
    
    

    var contenu = {
        nbrPersons : nbrPersons,
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
      newRecipe.link = $('div.m_titre_resultat a', link).attr('href');
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
