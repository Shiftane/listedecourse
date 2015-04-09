'use strict';

/**
 * Module dependencies.
 */
var 
  //mongoose = require('mongoose'),
  //Recipe = mongoose.model('recipe'),
  cheerio = require('cheerio'),
  request = require('request'),
  //config = require('meanio').loadConfig();
  searchresultCtrl = require('../../../commons/server/controllers/searchresults');

var siteName = 'CuisineAZ';
var baseUrl = 'http://www.cuisineaz.com';
var url = 'http://www.cuisineaz.com/recettes/recherche_v2.aspx?recherche=';
var logoUrl = 'http://www.cuisineaz.com/favicon.ico';


// PARSING PLACEHOLDER
var resultsPath = 'div.resultContainer';
var titlePlaceHolder = 'h2';
var linkDetails = 'a.rechRecetTitle';

// Recipe Detail
var recettePath = 'div.hrecipe';
var titleDetailPlaceHolder = 'h1';
var prepTimePlaceHolder = 'span.preptime>span';
var cookTimePlaceHolder = 'span.cooktime>span';
var descriptionPlaceHolder = 'span.instructions';
var imagePlaceHolder = 'img.photo';

// UNITIES AND SEPARATOR FOR PARSER
var unities = ['cuillère à café', ,' tasse ', ' tasses ', ' grosses cuillères à café ', ' cuillères à café ', ' kg ',' g ', ' louche ', ' louches ', ' cube ', 'feuilles', 'ml', ' pot ', ' petit pot ', ' litre ', 'cuillère à soupe', 'cuillères à soupe', ' dosette ', ' gousses ', ' gousse ', ' quelque ', ' quelques ', ' paquet ', ' cl ', ' pincée '];
var separator = ['de', 'd\'', 'du'];
var minmaxSeparator = 'à';

/*
 * Method to parse result from Marmiton with cheerio
*/
var parseSearchResponse = function(body, urlSwissmilk){
  console.log('Request done : TRY TO PARSE IT');
    var result = [];
    var $ = cheerio.load(body);
    var results = $(resultsPath);
    
    $(results).each(function(i, link){

      var newRecipe = {};

      //TODO : STORE THIS INFORMATION IN JSON AND THEN DB
      newRecipe.title = $(titlePlaceHolder,link).text().trim();
      newRecipe.link = $(linkDetails, link).attr('href');
      if(newRecipe.link)newRecipe.link = newRecipe.link.replace(baseUrl, '');
      newRecipe.prepTime = $(prepTimePlaceHolder, link).parent().text().trim();
      newRecipe.cookingTime = $(cookTimePlaceHolder, link).parent().text().trim();
      newRecipe.details = $('div.m_detail_recette', link).text().trim();
      newRecipe.text = $(descriptionPlaceHolder, link).text().trim();
      result.push(newRecipe);
    });
    console.log('Results Parsed '+result.length);
    var response = {
        origin : siteName,
        logoUrl : logoUrl,
        baseUrl : baseUrl,
        calledUrl : urlSwissmilk,
        message: 'Parsing finished',
        result: result,
        status: 'success'
    };  
    return response;
};

/*
 * Method to eval unity
*/

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

var parseRecetteR = function(body, recetteUrl){
  var $ = cheerio.load(body);
  //console.log('BODY PARSED BY CHEERIO : ' + body);
  var recette = $(recettePath); //use your CSS selector here
  var newRecipe = {};
  newRecipe.title = $(titleDetailPlaceHolder,recette).text().trim();
  console.log('test re ' + $(titleDetailPlaceHolder,recette));
  newRecipe.prepTime = $(prepTimePlaceHolder, recette).text().trim();
  newRecipe.cookingTime = $(cookTimePlaceHolder, recette).text().trim();
  newRecipe.image = $(imagePlaceHolder, recette).attr('src');
  newRecipe.description = $(descriptionPlaceHolder).html();
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
          // get only the quantity part
          var quantityStr = ingredientStr.substring(0, resultIndex).trim();
          // FIND a "à"" in the middle to separate min and max value
          // ex. "250 à 300 gr de confiture"
          var startIndex = 0;
          if(quantityStr.indexOf(minmaxSeparator) > -1){
            startIndex = quantityStr.indexOf(minmaxSeparator)+1;
          }
          try{
            ingredient.quantity = eval(quantityStr.substring(startIndex, quantityStr.length).trim());
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
      origin : siteName,
      recipeUrl : recetteUrl,
      logoUrl : logoUrl,
      message: 'Parsing finished',
      result: newRecipe,
      status: 'success'
  };
  return response;
};

/**
 * Get detail Recette with cheerio
 */
exports.getRecette = function(req, res){  
  var recetteUrl = req.params.url;
  console.log('Try to reach : ' + recetteUrl);
  
  var options = {
    url: recetteUrl,
    headers: {
        'User-Agent': 'Mozilla/5.0'
      },
    timeout : 3000
  };
  request(options, function(err, resp, body){
    if(err){
      //Case if the Marmiton website is NOT available
      console.log('Request done : ERORR --> ' + err);
      var cachedResults = searchresultCtrl.searchresultbyUrl(recetteUrl);
      console.log('Try to get from cache');
      cachedResults.exec(function(err, searchresults){
        if (err) {
          console.log('Error getting from cache : ' + err);
          return {
            error: 'Cannot find searchresults with URL = ' + recetteUrl
          };
        }
        console.log('get from cache success ' + searchresults[0]);
        //console.log('Result from cache : ' + searchresults);
        if(searchresults.length > 0){
          body = searchresults[0].resultsHTML;
          console.log('Result get from CACHE : extract --> ' + body.substring(50));
          res.json(parseRecetteR(body, recetteUrl));
        }else{
          // NO manner to get Recipe
          var response = {
              origin : siteName,
              baseUrl : baseUrl,
              recipeUrl : recetteUrl,
              logoUrl : logoUrl,
              message: err,
              status: 'error'
          };
          res.json(response);
        }
      });
    }else{
      // SAVE RESULT IN DB
      var searchresults = {searchURL:recetteUrl,resultsHTML:body};
      var createResult = searchresultCtrl.create(searchresults, req.user);
      if(createResult && createResult.error){
        console.log(createResult.error);
      }
      console.log('Result Saved in cache');

      //Case if the Marmiton website is available
      console.log('Request done : TRY TO PARSE IT  URL= ' + recetteUrl);
      res.json(parseRecetteR(body, recetteUrl));
    }
  });
  
};

/**
 * Search in Marmiton
 */
exports.searchMarmiton = function(req, res) {
  var searchTerm = req.params.q;
  console.log('SearchTerm : ' + searchTerm);

  // START TO SEARCH ON MARMITON
  // Specific Addition of word in marmiton with "-"
  var urlSearch = url + searchTerm.replace(' ', '-');  
  console.log('Try to reach : ' + urlSearch);
  var options = {
    url: urlSearch,
    headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      timeout : 5000
  };
  request(options, function(err, resp, body){
    var response = {};
    if(err){
      // We get from the cache if Marmiton is down
      console.log('Request done : ERORR --> ' + err);
      var cachedResults = searchresultCtrl.searchresultbyUrl(urlSearch);
      console.log('Try to get from cache');
      cachedResults.exec(function(err, searchresults){
        if (err) {
          console.log('Error getting from cache : ' + err);
          return {
            error: 'Cannot find searchresults with URL = ' + urlSearch
          };
        }
        console.log('get from cache success ');
        // + searchresults[0]);
        //console.log('Result from cache : ' + searchresults);
        if(searchresults.length > 0){
          body = searchresults[0].resultsHTML;
          console.log('Result get from CACHE : extract --> ' + body.substring(50));
          res.json(parseSearchResponse(body, urlSearch));
        }else{
          // NO manner to get Recipe
          response = {
            origin : siteName,
            logoUrl : logoUrl,
            baseUrl : baseUrl,
            calledUrl : urlSearch,
            message: err,
            status: 'error'
          };
          res.json(response);
        }
      });
    }else{
      // Marmiton is available, we save the result in DB and parse the content
      console.log(urlSearch + ' REACHED SUCCESSFULY');
      // SAVE RESULT IN DB
      var searchresults = {searchURL:urlSearch,resultsHTML:body};
      var createResult = searchresultCtrl.create(searchresults, req.user);
      if(createResult && createResult.error){
        console.log(createResult.error);
      }
      console.log('Result Saved in cache');
      res.json(parseSearchResponse(body, urlSearch));
    }
    
  });
  
};


