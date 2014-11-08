'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Marmitonsnippet = new Module('marmitonsnippet');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Marmitonsnippet.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Marmitonsnippet.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Marmitonsnippet.menus.add({
    title: 'Recherche de recette',
    link: 'marmiton search',
    roles: ['anonymous'],
    menu: 'main'
  });
  
  Marmitonsnippet.aggregateAsset('css', 'marmitonsnippet.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Marmitonsnippet.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Marmitonsnippet.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Marmitonsnippet.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Marmitonsnippet;
});
