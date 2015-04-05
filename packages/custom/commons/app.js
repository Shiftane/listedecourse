'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Commons = new Module('commons');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Commons.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Commons.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  /*Commons.menus.add({
    title: 'Recherche de recette',
    link: 'marmiton search',
    roles: ['anonymous'],
    menu: 'main'
  });*/
  
  Commons.aggregateAsset('css', 'marmitonsnippet.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Commons.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Commons.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Commons.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Commons;
});
