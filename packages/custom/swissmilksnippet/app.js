'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Swissmilksnippet = new Module('swissmilksnippet');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Swissmilksnippet.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Swissmilksnippet.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  /*Swissmilksnippet.menus.add({
    title: 'Recherche de recette',
    link: 'marmiton search',
    roles: ['anonymous'],
    menu: 'main'
  });*/
  
  Swissmilksnippet.aggregateAsset('css', 'swissmilksnippet.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Swissmilksnippet.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Swissmilksnippet.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Swissmilksnippet.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Swissmilksnippet;
});
